'use strict';

// Minimal local-only ASR proof of concept.
// It intentionally has no Electron, renderer, microphone, task, or network code.

const fs = require('fs/promises');
const path = require('path');
const sherpa = require('sherpa-onnx');
const {
  ASR_MODEL_CONFIG,
  createModelRuntimePaths,
  getRequiredModelEntries
} = require('../src/asr/asrModelConfig');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_MODEL_DIRECTORY = path.join(PROJECT_ROOT, 'dev_models', ASR_MODEL_CONFIG.modelId);

class PocError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'PocError';
    this.code = code;
  }
}

function printUsage() {
  console.log(`用法：node scripts/asr-wav-poc.js <单声道-WAV路径> [--model-dir <模型目录>]

默认模型目录：
  ${DEFAULT_MODEL_DIRECTORY}

此 PoC 只使用本机的 WAV、模型文件和 sherpa-onnx WebAssembly；不会联网、不会调用云端服务。`);
}

function parseArguments(argv) {
  const argumentsWithoutNode = argv.slice(2);
  if (argumentsWithoutNode.includes('--help') || argumentsWithoutNode.includes('-h')) {
    return { help: true };
  }

  let wavPath = '';
  let modelDirectory = DEFAULT_MODEL_DIRECTORY;

  for (let index = 0; index < argumentsWithoutNode.length; index += 1) {
    const value = argumentsWithoutNode[index];
    if (value === '--model-dir') {
      const directory = argumentsWithoutNode[index + 1];
      if (!directory || directory.startsWith('--')) {
        throw new PocError('ARGUMENT_ERROR', '--model-dir 后必须提供模型目录。');
      }
      modelDirectory = path.resolve(directory);
      index += 1;
      continue;
    }

    if (value.startsWith('--')) {
      throw new PocError('ARGUMENT_ERROR', `未知参数：${value}`);
    }
    if (wavPath) throw new PocError('ARGUMENT_ERROR', '只能提供一个 WAV 文件。');
    wavPath = path.resolve(value);
  }

  if (!wavPath) throw new PocError('ARGUMENT_ERROR', '请提供一个单声道 WAV 文件。');
  return { wavPath, modelDirectory };
}

async function requireRegularFile(filePath, label) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new PocError('FILE_NOT_REGULAR', `${label} 不是普通文件：${filePath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new PocError('FILE_MISSING', `${label} 不存在：${filePath}`);
    }
    throw error;
  }
}

async function validateModelFiles(modelDirectory) {
  const missingFiles = [];
  for (const entry of getRequiredModelEntries(ASR_MODEL_CONFIG)) {
    if (entry.requiredForPoc === false) continue;
    try {
      const stat = await fs.stat(path.join(modelDirectory, entry.relativePath));
      const matchesExpectedType = entry.type === 'directory' ? stat.isDirectory() : stat.isFile();
      if (!matchesExpectedType) missingFiles.push(entry.relativePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        missingFiles.push(entry.relativePath);
        continue;
      }
      throw error;
    }
  }

  if (missingFiles.length > 0) {
    throw new PocError(
      'MODEL_FILES_MISSING',
      `模型加载前检查失败。目录：${modelDirectory}\n缺少文件：${missingFiles.join('、')}`
    );
  }
}

async function inspectMonoWav(wavPath) {
  await requireRegularFile(wavPath, 'WAV 文件');
  const file = await fs.open(wavPath, 'r');

  try {
    const header = Buffer.alloc(12);
    const { bytesRead } = await file.read(header, 0, header.length, 0);
    if (bytesRead !== header.length || header.toString('ascii', 0, 4) !== 'RIFF' || header.toString('ascii', 8, 12) !== 'WAVE') {
      throw new PocError('INVALID_WAV', '输入不是有效的 RIFF/WAVE 文件。');
    }

    let position = 12;
    let format = null;
    const stat = await file.stat();
    while (position + 8 <= stat.size) {
      const chunkHeader = Buffer.alloc(8);
      const chunkRead = await file.read(chunkHeader, 0, chunkHeader.length, position);
      if (chunkRead.bytesRead !== chunkHeader.length) break;

      const chunkId = chunkHeader.toString('ascii', 0, 4);
      const chunkSize = chunkHeader.readUInt32LE(4);
      if (position + 8 + chunkSize > stat.size) {
        throw new PocError('INVALID_WAV', 'WAV 文件包含不完整的数据块。');
      }

      if (chunkId === 'fmt ') {
        if (chunkSize < 16) throw new PocError('INVALID_WAV', 'WAV fmt 数据块无效。');
        const formatBuffer = Buffer.alloc(16);
        await file.read(formatBuffer, 0, formatBuffer.length, position + 8);
        format = {
          audioFormat: formatBuffer.readUInt16LE(0),
          channels: formatBuffer.readUInt16LE(2),
          sampleRate: formatBuffer.readUInt32LE(4)
        };
      }

      position += 8 + chunkSize + (chunkSize % 2);
    }

    if (!format) throw new PocError('INVALID_WAV', 'WAV 文件缺少 fmt 数据块。');
    if (format.channels !== 1) {
      throw new PocError('WAV_NOT_MONO', `只支持单声道 WAV；当前为 ${format.channels} 声道。`);
    }
    if (format.audioFormat !== 1 && format.audioFormat !== 3) {
      throw new PocError('WAV_FORMAT_UNSUPPORTED', `不支持的 WAV 编码格式：${format.audioFormat}。请使用标准 PCM 或 IEEE float WAV。`);
    }

    return format;
  } finally {
    await file.close();
  }
}

function createRecognizer(modelDirectory) {
  const modelPaths = createModelRuntimePaths(modelDirectory, ASR_MODEL_CONFIG);
  return sherpa.createOfflineRecognizer({
    featConfig: {
      sampleRate: ASR_MODEL_CONFIG.sampleRate,
      featureDim: ASR_MODEL_CONFIG.featureDim
    },
    modelConfig: {
      qwen3Asr: {
        convFrontend: modelPaths.files.convFrontend,
        encoder: modelPaths.files.encoder,
        decoder: modelPaths.files.decoder,
        tokenizer: modelPaths.files.tokenizer,
        ...modelPaths.decoding
      },
      // Qwen3-ASR uses its tokenizer directory rather than a tokens.txt file.
      tokens: '',
      numThreads: ASR_MODEL_CONFIG.numThreads,
      provider: ASR_MODEL_CONFIG.provider,
      debug: 0
    },
    decodingMethod: 'greedy_search',
    maxActivePaths: 4
  });
}

function recognizeWav(wavPath, modelDirectory) {
  let recognizer = null;
  let stream = null;

  try {
    recognizer = createRecognizer(modelDirectory);
    if (!recognizer || !recognizer.handle) {
      throw new PocError(
        'MODEL_LOAD_FAILED',
        'sherpa-onnx 无法创建 Qwen3-ASR recognizer。请检查模型文件是否完整、是否与当前 sherpa-onnx 版本兼容。'
      );
    }
    stream = recognizer.createStream();
    if (!stream || !stream.handle) {
      throw new PocError('MODEL_LOAD_FAILED', 'sherpa-onnx 无法为 Qwen3-ASR 创建识别流。');
    }
    const wave = sherpa.readWave(wavPath);

    if (!wave || !(wave.samples instanceof Float32Array)) {
      throw new PocError('WAV_READ_FAILED', 'sherpa-onnx 无法读取该 WAV 文件。');
    }
    // Qwen3-ASR is a non-streaming recognizer. sherpa-onnx receives the WAV's
    // actual sample rate and performs its local conversion to the configured
    // 16 kHz feature-extractor rate when necessary.
    stream.acceptWaveform(wave.sampleRate, wave.samples);
    recognizer.decode(stream);
    return recognizer.getResult(stream);
  } catch (error) {
    if (error instanceof PocError) throw error;
    throw new PocError('ASR_RUNTIME_ERROR', `sherpa-onnx WebAssembly 加载或识别失败：${error.message || String(error)}`);
  } finally {
    if (stream) stream.free();
    if (recognizer) recognizer.free();
  }
}

async function main() {
  const options = parseArguments(process.argv);
  if (options.help) {
    printUsage();
    return;
  }

  await validateModelFiles(options.modelDirectory);
  const wavFormat = await inspectMonoWav(options.wavPath);

  console.log(`sherpa-onnx ${sherpa.version}（WebAssembly）`);
  console.log(`模型：${ASR_MODEL_CONFIG.modelId}`);
  console.log(`WAV：${options.wavPath}`);
  console.log(`输入音频：单声道 ${wavFormat.sampleRate} Hz；模型特征采样率：${ASR_MODEL_CONFIG.sampleRate} Hz`);
  const result = recognizeWav(options.wavPath, options.modelDirectory);
  console.log(`最终识别文字：${String(result.text || '').trim()}`);
}

main().catch((error) => {
  const code = error && error.code ? error.code : 'UNEXPECTED_ERROR';
  console.error(`ASR PoC 失败 [${code}]：${error.message || String(error)}`);
  process.exitCode = 1;
});
