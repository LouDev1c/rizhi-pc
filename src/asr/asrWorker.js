'use strict';

const { isMainThread, parentPort } = require('worker_threads');
const sherpa = require('sherpa-onnx');

// Qwen3-ASR is an offline recognizer. Realtime audio is segmented locally with
// Silero VAD and each completed segment is decoded exactly once. This avoids
// retaining or repeatedly decoding a full microphone recording.
function createAsrWorkerRuntime(port) {
  if (!port || typeof port.on !== 'function' || typeof port.postMessage !== 'function') {
    throw new TypeError('ASR Worker 需要一个 MessagePort。');
  }

  let isInitialized = false;
  let isRecording = false;
  let modelStatus = null;
  let recognizer = null;
  let recordedSampleCount = 0;
  let vad = null;
  let vadSpeechDetected = false;
  let transcriptSegments = [];

  function postResponse(requestId, payload) {
    port.postMessage({ type: 'response', requestId, ok: true, payload });
  }

  function postError(requestId, error) {
    port.postMessage({ type: 'response', requestId, ok: false, error: serializeError(error) });
  }

  function postEvent(event, payload) {
    port.postMessage({ type: 'event', event, payload });
  }

  function postState(state) {
    postEvent('state', { state });
  }

  function requireInitialized() {
    if (isInitialized) return;
    const error = new Error('ASR Worker 尚未初始化。');
    error.code = 'ASR_NOT_INITIALIZED';
    throw error;
  }

  function requireRecognizer() {
    if (recognizer && recognizer.handle) return;
    const error = new Error('Qwen3-ASR 模型尚未成功加载。');
    error.code = 'ASR_MODEL_NOT_READY';
    throw error;
  }

  function createRecognizer(runtimeConfig) {
    const files = runtimeConfig && runtimeConfig.files;
    if (!runtimeConfig || runtimeConfig.modelKind !== 'qwen3Asr' || !files) {
      const error = new Error('当前 ASR Worker 只支持已配置的 Qwen3-ASR 离线模型。');
      error.code = 'ASR_UNSUPPORTED_MODEL';
      throw error;
    }

    return sherpa.createOfflineRecognizer({
      featConfig: {
        sampleRate: runtimeConfig.sampleRate,
        featureDim: runtimeConfig.featureDim
      },
      modelConfig: {
        qwen3Asr: {
          convFrontend: files.convFrontend,
          encoder: files.encoder,
          decoder: files.decoder,
          tokenizer: files.tokenizer,
          ...(runtimeConfig.decoding || {})
        },
        tokens: '',
        numThreads: runtimeConfig.numThreads,
        provider: runtimeConfig.provider,
        debug: 0
      },
      decodingMethod: 'greedy_search',
      maxActivePaths: 4
    });
  }

  function releaseRecognizer() {
    if (recognizer) recognizer.free();
    recognizer = null;
  }

  function createVad(runtimeConfig) {
    const vadConfig = runtimeConfig && runtimeConfig.realtime && runtimeConfig.realtime.vad;
    if (!vadConfig || !runtimeConfig.files || !runtimeConfig.files.vad) {
      const error = new Error('ASR 实时配置缺少本地 VAD 模型。');
      error.code = 'ASR_VAD_CONFIG_MISSING';
      throw error;
    }

    return sherpa.createVad({
      sileroVad: {
        model: runtimeConfig.files.vad,
        ...vadConfig
      },
      sampleRate: runtimeConfig.sampleRate,
      numThreads: runtimeConfig.numThreads,
      provider: runtimeConfig.provider,
      debug: 0,
      bufferSizeInSeconds: vadConfig.bufferSizeInSeconds
    });
  }

  function requireVad() {
    if (vad && vad.handle) return;
    const error = new Error('本地 VAD 模型尚未成功加载。请确认 silero_vad.onnx 位于当前 ASR 模型目录。');
    error.code = 'ASR_VAD_NOT_READY';
    throw error;
  }

  function releaseVad() {
    if (vad) vad.free();
    vad = null;
  }

  function clearRecording() {
    recordedSampleCount = 0;
    transcriptSegments = [];
    vadSpeechDetected = false;
    if (vad) vad.reset();
  }

  function reportVadState() {
    const detected = Boolean(vad && vad.isDetected());
    if (detected === vadSpeechDetected) return;
    vadSpeechDetected = detected;
    postEvent('vad', { detected });
  }

  function decodeSamples(samples, sampleRate) {
    if (!samples.length) return { result: { text: '' }, decodeElapsedMs: 0 };
    requireRecognizer();
    const stream = recognizer.createStream();
    const startedAt = Date.now();
    try {
      stream.acceptWaveform(sampleRate, samples);
      recognizer.decode(stream);
      return {
        result: recognizer.getResult(stream) || { text: '' },
        decodeElapsedMs: Date.now() - startedAt
      };
    } finally {
      stream.free();
    }
  }

  function getTranscript() {
    return transcriptSegments.join('').trim();
  }

  function decodeReadyVadSegments(emitPartial) {
    requireVad();
    while (!vad.isEmpty()) {
      const segment = vad.front();
      vad.pop();
      const decoded = decodeSamples(segment.samples, modelStatus.runtimeConfig.sampleRate);
      const text = String(decoded.result.text || '').trim();
      if (text) transcriptSegments.push(text);
      if (emitPartial) {
        postEvent('partial', {
          text: getTranscript(),
          segmentText: text,
          segmentStartSeconds: segment.start / modelStatus.runtimeConfig.sampleRate,
          segmentDurationSeconds: segment.samples.length / modelStatus.runtimeConfig.sampleRate,
          decodeElapsedMs: decoded.decodeElapsedMs,
          durationSeconds: recordedSampleCount / modelStatus.runtimeConfig.sampleRate,
          isSnapshot: false
        });
      }
    }
  }

  function finalizeMaximumDuration() {
    vad.flush();
    decodeReadyVadSegments(true);
    const durationSeconds = recordedSampleCount / modelStatus.runtimeConfig.sampleRate;
    const finalText = getTranscript();
    isRecording = false;
    const maxDuration = modelStatus.runtimeConfig.realtime.maxRecordingDurationSeconds;
    postEvent('final', {
      text: finalText,
      durationSeconds,
      isSnapshot: false,
      automaticallyStopped: true
    });
    clearRecording();
    postState('ready');
    postEvent('limit', { maxDurationSeconds: maxDuration, durationSeconds });
  }

  function handleAudioFrame(samples, sampleRate) {
    requireInitialized();
    if (!isRecording || !(samples instanceof Float32Array) || !samples.length) return;
    if (sampleRate !== modelStatus.runtimeConfig.sampleRate) {
      const error = new Error(`音频帧采样率必须为 ${modelStatus.runtimeConfig.sampleRate} Hz，实际为 ${sampleRate} Hz。`);
      error.code = 'ASR_SAMPLE_RATE_MISMATCH';
      throw error;
    }

    const maxSamples = Math.round(
      modelStatus.runtimeConfig.realtime.maxRecordingDurationSeconds * sampleRate
    );
    const remainingSamples = maxSamples - recordedSampleCount;
    if (remainingSamples <= 0) {
      finalizeMaximumDuration();
      return;
    }

    const acceptedSamples = samples.length > remainingSamples
      ? samples.slice(0, remainingSamples)
      : samples;
    vad.acceptWaveform(acceptedSamples);
    recordedSampleCount += acceptedSamples.length;
    reportVadState();
    decodeReadyVadSegments(true);
    reportVadState();
    if (recordedSampleCount >= maxSamples) finalizeMaximumDuration();
  }

  port.on('message', (message = {}) => {
    const { type, requestId } = message;
    try {
      if (type === 'initialize') {
        modelStatus = message.modelStatus || null;
        releaseVad();
        releaseRecognizer();
        if (modelStatus && modelStatus.isReady) {
          recognizer = createRecognizer(modelStatus.runtimeConfig);
          vad = createVad(modelStatus.runtimeConfig);
          if (!recognizer || !recognizer.handle || !vad || !vad.handle) {
            const error = new Error('sherpa-onnx 无法创建 Qwen3-ASR 或 VAD 运行时。');
            error.code = 'ASR_MODEL_LOAD_FAILED';
            throw error;
          }
        }
        clearRecording();
        isInitialized = true;
        postState(modelStatus && modelStatus.isReady ? 'ready' : 'model-missing');
        postResponse(requestId, {
          initialized: true,
          modelReady: Boolean(modelStatus && modelStatus.isReady),
          inferenceImplemented: Boolean(modelStatus && modelStatus.isReady)
        });
        return;
      }

      if (type === 'start') {
        requireInitialized();
        if (!modelStatus || !modelStatus.isReady) {
          const error = new Error('ASR 模型文件尚未就绪。请确认 Qwen3-ASR 文件和 silero_vad.onnx 都已放入模型目录。');
          error.code = 'ASR_MODEL_NOT_READY';
          throw error;
        }
        requireRecognizer();
        requireVad();
        clearRecording();
        isRecording = true;
        postState('recording');
        postResponse(requestId, {
          started: true,
          partialMode: 'vad-segment',
          maxRecordingDurationSeconds: modelStatus.runtimeConfig.realtime.maxRecordingDurationSeconds
        });
        return;
      }

      if (type === 'audio') {
        handleAudioFrame(message.samples, message.sampleRate);
        return;
      }

      if (type === 'cancel') {
        requireInitialized();
        isRecording = false;
        clearRecording();
        postState(modelStatus && modelStatus.isReady ? 'ready' : 'model-missing');
        postResponse(requestId, { canceled: true });
        return;
      }

      if (type === 'stop') {
        requireInitialized();
        let finalText = '';
        if (isRecording) {
          vad.flush();
          decodeReadyVadSegments(true);
          finalText = getTranscript();
          postEvent('final', {
            text: finalText,
            durationSeconds: recordedSampleCount / modelStatus.runtimeConfig.sampleRate,
            isSnapshot: false
          });
        }
        isRecording = false;
        clearRecording();
        postState(modelStatus && modelStatus.isReady ? 'ready' : 'model-missing');
        postResponse(requestId, { stopped: true, finalText });
        return;
      }

      if (type === 'dispose') {
        isRecording = false;
        clearRecording();
        releaseVad();
        releaseRecognizer();
        isInitialized = false;
        modelStatus = null;
        postState('disposed');
        postResponse(requestId, { disposed: true });
        return;
      }

      const error = new Error(`不支持的 ASR Worker 消息：${String(type)}`);
      error.code = 'ASR_UNSUPPORTED_MESSAGE';
      throw error;
    } catch (error) {
      if (requestId) postError(requestId, error);
      else postEvent('error', serializeError(error));
    }
  });
}

function serializeError(error) {
  return {
    code: error && error.code ? error.code : 'ASR_WORKER_ERROR',
    message: error && error.message ? error.message : 'ASR Worker 出现未知错误。'
  };
}

if (!isMainThread && parentPort) createAsrWorkerRuntime(parentPort);

module.exports = {
  createAsrWorkerRuntime
};
