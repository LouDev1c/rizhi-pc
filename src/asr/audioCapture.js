'use strict';

// Renderer-side microphone capture. It owns no model and sends only resampled
// mono Float32 PCM frames to the narrow preload IPC surface.
(function exposeAudioCapture(root) {
  class AudioCaptureError extends Error {
    constructor(code, message) {
      super(message);
      this.name = 'AudioCaptureError';
      this.code = code;
    }
  }

  class AudioCapture {
    constructor({ sampleRate, frameDurationMs = 100, deviceId = '', mediaDevices, audioContextFactory, workletModuleUrl } = {}) {
      if (!Number.isInteger(sampleRate) || sampleRate <= 0) {
        throw new TypeError('AudioCapture 需要一个有效的目标采样率。');
      }

      this.sampleRate = sampleRate;
      this.frameDurationMs = frameDurationMs;
      this.deviceId = String(deviceId || '');
      this.mediaDevices = mediaDevices || (typeof navigator !== 'undefined' ? navigator.mediaDevices : null);
      this.audioContextFactory = audioContextFactory || ((options) => new AudioContext(options));
      this.workletModuleUrl = workletModuleUrl || new URL('./asr/audioWorkletProcessor.js', window.location.href).toString();
      this.listeners = new Set();
      this.stream = null;
      this.audioContext = null;
      this.sourceNode = null;
      this.workletNode = null;
      this.silentGainNode = null;
      this.flushRequest = null;
      this.workletLoaded = false;
      this.state = 'idle';
    }

    async initialize() {
      if (this.state === 'disposed') throw new AudioCaptureError('MIC_CAPTURE_DISPOSED', '麦克风采集器已经释放。');
      if (!this.mediaDevices || typeof this.mediaDevices.getUserMedia !== 'function') {
        throw new AudioCaptureError('MIC_CAPTURE_UNAVAILABLE', '当前 Electron 环境不支持 navigator.mediaDevices.getUserMedia。');
      }

      if (!this.audioContext) this.audioContext = this.audioContextFactory({ sampleRate: this.sampleRate });
      if (!this.audioContext.audioWorklet || typeof AudioWorkletNode === 'undefined') {
        throw new AudioCaptureError('AUDIO_WORKLET_UNAVAILABLE', '当前环境不支持 AudioWorklet，无法安全采集实时音频。');
      }
      if (!this.workletLoaded) {
        try {
          await this.audioContext.audioWorklet.addModule(this.workletModuleUrl);
          this.workletLoaded = true;
        } catch (error) {
          throw new AudioCaptureError('AUDIO_WORKLET_LOAD_FAILED', `无法加载音频采集 Worklet：${error.message || String(error)}`);
        }
      }

      this.state = 'ready';
      return { sampleRate: this.sampleRate, state: this.state };
    }

    async start() {
      if (this.state === 'idle') await this.initialize();
      if (this.state === 'recording') return { started: true, alreadyStarted: true };
      if (this.state === 'disposed') throw new AudioCaptureError('MIC_CAPTURE_DISPOSED', '麦克风采集器已经释放。');

      try {
        this.stream = await this.mediaDevices.getUserMedia({ audio: this.createAudioConstraints(), video: false });
      } catch (error) {
        throw normalizeMicrophoneError(error);
      }

      try {
        if (this.audioContext.state === 'suspended') await this.audioContext.resume();
        this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
        this.workletNode = new AudioWorkletNode(this.audioContext, 'rizhi-pcm-capture', {
          numberOfInputs: 1,
          numberOfOutputs: 1,
          outputChannelCount: [1],
          processorOptions: {
            targetSampleRate: this.sampleRate,
            frameDurationMs: this.frameDurationMs
          }
        });
        this.silentGainNode = this.audioContext.createGain();
        this.silentGainNode.gain.value = 0;
        this.workletNode.port.onmessage = (event) => this.handleWorkletMessage(event.data || {});
        this.workletNode.onprocessorerror = () => this.handleProcessorError();
        this.sourceNode.connect(this.workletNode);
        this.workletNode.connect(this.silentGainNode);
        this.silentGainNode.connect(this.audioContext.destination);
        this.state = 'recording';
        return {
          started: true,
          sampleRate: this.sampleRate,
          inputSampleRate: this.audioContext.sampleRate
        };
      } catch (error) {
        this.disconnectGraph();
        this.stopTracks();
        throw error instanceof AudioCaptureError
          ? error
          : new AudioCaptureError('MIC_CAPTURE_START_FAILED', `无法启动麦克风音频图：${error.message || String(error)}`);
      }
    }

    async stop() {
      if (this.state !== 'recording') return { stopped: true, alreadyStopped: true };

      // Release the physical microphone first. Flushing only drains PCM that
      // was already captured by the AudioWorklet; it must not keep recording.
      this.stopTracks();
      await this.flushWorklet();
      this.disconnectGraph();
      this.state = 'ready';
      return { stopped: true };
    }

    async dispose() {
      if (this.state === 'disposed') return;
      await this.stop();
      if (this.audioContext && this.audioContext.state !== 'closed') await this.audioContext.close();
      this.audioContext = null;
      this.listeners.clear();
      this.state = 'disposed';
    }

    onAudioFrame(listener) {
      if (typeof listener !== 'function') throw new TypeError('音频帧监听器必须是函数。');
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    setDeviceId(deviceId) {
      if (this.state === 'recording') {
        throw new AudioCaptureError('MIC_DEVICE_CHANGE_DURING_CAPTURE', '请先停止当前录音，再切换输入设备。');
      }
      this.deviceId = String(deviceId || '');
    }

    createAudioConstraints() {
      return {
        deviceId: this.deviceId ? { exact: this.deviceId } : undefined,
        channelCount: { ideal: 1 },
        sampleRate: { ideal: this.sampleRate },
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      };
    }

    handleWorkletMessage(message) {
      if (message.type === 'frame' && message.samples instanceof Float32Array) {
        this.listeners.forEach((listener) => listener({ samples: message.samples, sampleRate: this.sampleRate }));
        return;
      }

      if (message.type === 'flushed' && this.flushRequest) {
        const { resolve, timeout } = this.flushRequest;
        this.flushRequest = null;
        window.clearTimeout(timeout);
        resolve();
      }
    }

    handleProcessorError() {
      if (this.state !== 'recording') return;
      this.state = 'error';
      this.listeners.forEach((listener) => listener({
        error: new AudioCaptureError('AUDIO_WORKLET_PROCESSOR_ERROR', '音频采集 Worklet 意外停止。')
      }));
    }

    async flushWorklet() {
      if (!this.workletNode) return;
      await new Promise((resolve) => {
        const timeout = window.setTimeout(() => {
          if (this.flushRequest) this.flushRequest = null;
          resolve();
        }, 1000);
        this.flushRequest = { resolve, timeout };
        this.workletNode.port.postMessage({ type: 'flush' });
      });
    }

    disconnectGraph() {
      [this.sourceNode, this.workletNode, this.silentGainNode].forEach((node) => {
        if (!node) return;
        try {
          node.disconnect();
        } catch (error) {
          // A node can already be disconnected after an audio device error.
        }
      });
      this.sourceNode = null;
      this.workletNode = null;
      this.silentGainNode = null;
    }

    stopTracks() {
      if (!this.stream) return;
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  function normalizeMicrophoneError(error) {
    if (error && (error.name === 'NotAllowedError' || error.name === 'SecurityError')) {
      return new AudioCaptureError(
        'MIC_PERMISSION_DENIED',
        '麦克风权限被拒绝。请在 Windows 隐私与安全性设置中允许“桌面应用访问麦克风”，然后重试。'
      );
    }
    if (error && error.name === 'NotFoundError') {
      return new AudioCaptureError('MIC_DEVICE_NOT_FOUND', '未找到可用麦克风。请连接或在系统中启用输入设备后重试。');
    }
    return new AudioCaptureError('MIC_CAPTURE_FAILED', `无法获取麦克风：${error && error.message ? error.message : String(error)}`);
  }

  async function getAudioInputDevices(mediaDevices = (typeof navigator !== 'undefined' ? navigator.mediaDevices : null)) {
    if (!mediaDevices || typeof mediaDevices.enumerateDevices !== 'function') {
      throw new AudioCaptureError('MIC_DEVICE_ENUMERATION_UNAVAILABLE', '当前环境无法枚举语音输入设备。');
    }
    const devices = await mediaDevices.enumerateDevices();
    return devices
      .filter((device) => device.kind === 'audioinput')
      .map((device) => ({ deviceId: device.deviceId, label: device.label, groupId: device.groupId }));
  }

  const api = { AudioCapture, AudioCaptureError, getAudioInputDevices };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.RizhiAsrAudioCapture = api;
})(typeof window !== 'undefined' ? window : globalThis);
