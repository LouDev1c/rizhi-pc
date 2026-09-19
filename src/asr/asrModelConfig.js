'use strict';

const path = require('path');

// This is the sole source of truth for the active ASR model. Keep it in the
// main/worker boundary; it is intentionally not loaded by renderer.js.
const ASR_MODEL_CONFIG = Object.freeze({
  modelId: 'sherpa-onnx-qwen3-asr-0.6B-int8-2026-03-25',
  modelVersion: '2026-03-25',
  runtime: 'offline',
  modelKind: 'qwen3Asr',
  sampleRate: 16000,
  featureDim: 128,
  provider: 'cpu',
  // sherpa-onnx's WebAssembly package is single-threaded. Keep the value at 1
  // until the runtime is intentionally changed to a multi-threaded backend.
  numThreads: 1,
  files: Object.freeze({
    convFrontend: Object.freeze({ relativePath: 'conv_frontend.onnx', type: 'file' }),
    encoder: Object.freeze({ relativePath: 'encoder.int8.onnx', type: 'file' }),
    decoder: Object.freeze({ relativePath: 'decoder.int8.onnx', type: 'file' }),
    tokenizer: Object.freeze({ relativePath: 'tokenizer', type: 'directory' }),
    // Realtime capture uses this local Silero VAD model to keep every Qwen
    // decode bounded to one speech segment. The WAV-only PoC does not need it.
    vad: Object.freeze({
      relativePath: 'silero_vad.onnx',
      type: 'file',
      requiredForPoc: false
    })
  }),
  // The application downloads only these official sherpa-onnx release assets.
  // The archive contains the Qwen model and tokenizer; VAD is a separate
  // official asset required by the realtime microphone pipeline.
  download: Object.freeze({
    displaySizeBytes: 879346277,
    assets: Object.freeze([
      Object.freeze({
        kind: 'archive',
        fileName: 'model.tar.bz2',
        url: 'https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-qwen3-asr-0.6B-int8-2026-03-25.tar.bz2',
        sizeBytes: 878702423
      }),
      Object.freeze({
        kind: 'file',
        relativePath: 'silero_vad.onnx',
        url: 'https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/silero_vad.onnx',
        sizeBytes: 643854
      })
    ])
  }),
  // Hashes are checked after extraction, before the staging directory is
  // promoted to userData. This verifies the files actually consumed by WASM.
  integrity: Object.freeze({
    files: Object.freeze({
      'conv_frontend.onnx': Object.freeze({ sizeBytes: 44148281, sha256: 'd22dc4423e0940e49884e903d2ea2f7e5567c14fc1aed97e4e26d6b8f208ef9e' }),
      'encoder.int8.onnx': Object.freeze({ sizeBytes: 182491662, sha256: '60748d3e6744a57c9c91e1b17424a6c2990567e8adceb0783940c03ed98fa9d9' }),
      'decoder.int8.onnx': Object.freeze({ sizeBytes: 755914231, sha256: '4f6885be5959ae26af3089d38ee7972c5fafbeeb1cf8d5e76eab6d8b61ca5771' }),
      'silero_vad.onnx': Object.freeze({ sizeBytes: 643854, sha256: '9e2449e1087496d8d4caba907f23e0bd3f78d91fa552479bb9c23ac09cbb1fd6' }),
      'tokenizer/merges.txt': Object.freeze({ sizeBytes: 1671853, sha256: '8831e4f1a044471340f7c0a83d7bd71306a5b867e95fd870f74d0c5308a904d5' }),
      'tokenizer/tokenizer_config.json': Object.freeze({ sizeBytes: 12487, sha256: '4942d005604266809309cabc9f4e9cb89ce855d59b14681fdc0e1cc62ea26c4c' }),
      'tokenizer/vocab.json': Object.freeze({ sizeBytes: 2776833, sha256: 'ca10d7e9fb3ed18575dd1e277a2579c16d108e32f27439684afa0e10b1440910' })
    })
  }),
  decoding: Object.freeze({
    maxTotalLen: 512,
    maxNewTokens: 128,
    temperature: 1e-6,
    topP: 0.8,
    seed: 42,
    hotwords: ''
  }),
  realtime: Object.freeze({
    // A worker-side guard prevents unbounded memory/WASM work if a renderer
    // timer is delayed or the microphone is left open accidentally.
    maxRecordingDurationSeconds: 90,
    vad: Object.freeze({
      threshold: 0.5,
      minSilenceDuration: 1.2,
      minSpeechDuration: 0.25,
      maxSpeechDuration: 12,
      windowSize: 512,
      bufferSizeInSeconds: 30
    })
  })
});

const DEVELOPMENT_MODEL_DIRECTORY_ENV = 'RIZHI_ASR_MODEL_DIR';

function assertAppPathProvider(app) {
  if (!app || typeof app.getPath !== 'function') {
    throw new TypeError('ASR 模型路径需要一个 Electron app 实例。');
  }
}

function getUserDataModelDirectory(app, modelConfig = ASR_MODEL_CONFIG) {
  assertAppPathProvider(app);
  return path.join(app.getPath('userData'), 'models', 'asr', modelConfig.modelId);
}

function getDevelopmentModelDirectory(app, developmentModelDirectory) {
  const configuredDirectory = String(
    developmentModelDirectory || process.env[DEVELOPMENT_MODEL_DIRECTORY_ENV] || ''
  ).trim();

  // A developer override is deliberately ignored by packaged builds. Installed
  // applications always use the userData location above.
  if (!configuredDirectory || (app && app.isPackaged)) return '';
  return path.resolve(configuredDirectory);
}

function resolveModelDirectory(app, options = {}) {
  const modelConfig = options.modelConfig || ASR_MODEL_CONFIG;
  const developmentDirectory = getDevelopmentModelDirectory(app, options.developmentModelDirectory);

  if (developmentDirectory) {
    return {
      directory: developmentDirectory,
      source: 'development'
    };
  }

  return {
    directory: getUserDataModelDirectory(app, modelConfig),
    source: 'userData'
  };
}

function createModelRuntimePaths(modelDirectory, modelConfig = ASR_MODEL_CONFIG) {
  if (!modelDirectory) throw new TypeError('ASR 模型目录不能为空。');

  const files = Object.fromEntries(
    getRequiredModelEntries(modelConfig).map((entry) => [
      entry.key,
      path.join(modelDirectory, entry.relativePath)
    ])
  );

  return {
    modelId: modelConfig.modelId,
    modelVersion: modelConfig.modelVersion,
    runtime: modelConfig.runtime,
    modelKind: modelConfig.modelKind,
    sampleRate: modelConfig.sampleRate,
    featureDim: modelConfig.featureDim,
    provider: modelConfig.provider,
    numThreads: modelConfig.numThreads,
    files,
    decoding: { ...modelConfig.decoding },
    realtime: {
      ...modelConfig.realtime,
      vad: { ...modelConfig.realtime.vad }
    }
  };
}

function getRequiredModelEntries(modelConfig = ASR_MODEL_CONFIG) {
  if (!modelConfig.files || typeof modelConfig.files !== 'object') {
    throw new TypeError('ASR 模型配置缺少 files。');
  }

  return Object.entries(modelConfig.files).map(([key, entry]) => ({
    key,
    relativePath: entry.relativePath,
    type: entry.type || 'file',
    requiredForPoc: entry.requiredForPoc !== false
  }));
}

module.exports = {
  ASR_MODEL_CONFIG,
  DEVELOPMENT_MODEL_DIRECTORY_ENV,
  createModelRuntimePaths,
  getDevelopmentModelDirectory,
  getRequiredModelEntries,
  getUserDataModelDirectory,
  resolveModelDirectory
};
