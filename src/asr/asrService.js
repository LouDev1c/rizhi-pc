'use strict';

const { EventEmitter } = require('events');
const path = require('path');
const { Worker } = require('worker_threads');
const { createAsrModelManager } = require('./modelManager');

class AsrServiceError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'AsrServiceError';
    this.code = code;
  }
}

// Main-process facade for the ASR worker. It has no renderer dependency and
// does not perform recognition itself.
class AsrService extends EventEmitter {
  constructor({ app, modelManager, workerPath } = {}) {
    super();

    if (!app || typeof app.getPath !== 'function') {
      throw new TypeError('AsrService 需要一个 Electron app 实例。');
    }

    this.app = app;
    this.modelManager = modelManager || createAsrModelManager({ app });
    this.workerPath = workerPath || path.join(__dirname, 'asrWorker.js');
    this.worker = null;
    this.state = 'idle';
    this.modelStatus = null;
    this.pendingRequests = new Map();
    this.requestSequence = 0;
    this.initializePromise = null;
    this.isDisposed = false;
  }

  async initialize() {
    if (this.isDisposed) throw new AsrServiceError('ASR_DISPOSED', 'ASR 服务已经释放。');
    // Keep the successfully loaded WASM models in the worker between separate
    // recordings. Recreating Qwen3-ASR for every microphone click is costly.
    if (this.worker && this.modelStatus && this.modelStatus.isReady && this.state === 'ready') {
      return {
        state: this.state,
        model: this.modelStatus,
        inferenceImplemented: true,
        cached: true,
        worker: { initialized: true, cached: true }
      };
    }
    if (this.initializePromise) return this.initializePromise;

    this.initializePromise = this.initializeInternal().finally(() => {
      this.initializePromise = null;
    });
    return this.initializePromise;
  }

  async initializeInternal() {
    this.setState('initializing');
    this.modelStatus = await this.modelManager.initialize();
    this.ensureWorker();
    // Loading the Qwen3 WASM model can take noticeably longer than a normal
    // IPC request. The wait is in the main process, never the renderer UI.
    const workerResult = await this.request('initialize', { modelStatus: this.modelStatus }, 180000);
    this.setState(this.modelStatus.isReady ? 'ready' : 'model-missing');

    return {
      state: this.state,
      model: this.modelStatus,
      inferenceImplemented: false,
      cached: false,
      worker: workerResult
    };
  }

  async start() {
    if (this.state === 'idle') await this.initialize();
    if (this.isDisposed) throw new AsrServiceError('ASR_DISPOSED', 'ASR 服务已经释放。');
    if (!this.modelStatus || !this.modelStatus.isReady) {
      throw new AsrServiceError('ASR_MODEL_NOT_READY', 'ASR 模型文件尚未就绪。');
    }
    if (this.state === 'recording') return { started: true, inferenceImplemented: false };

    const result = await this.request('start');
    this.setState('recording');
    return result;
  }

  async stop() {
    if (this.isDisposed) return { stopped: true, disposed: true };
    if (!this.worker || this.state !== 'recording') return { stopped: true, alreadyStopped: true };

    // Stop flushes and decodes only the remaining bounded VAD segment in the
    // worker, but model inference can still take longer than ordinary IPC.
    const result = await this.request('stop', {}, 180000);
    this.setState(this.modelStatus && this.modelStatus.isReady ? 'ready' : 'model-missing');
    return result;
  }

  async cancel() {
    if (this.isDisposed) return { canceled: true, disposed: true };
    if (!this.worker || this.state !== 'recording') return { canceled: true, alreadyStopped: true };

    // A bounded VAD-segment decode may already be running in the worker.
    // Cancellation waits for it but prevents a final-result event.
    const result = await this.request('cancel', {}, 180000);
    this.setState(this.modelStatus && this.modelStatus.isReady ? 'ready' : 'model-missing');
    return result;
  }

  acceptAudioFrame(samples, sampleRate) {
    if (this.isDisposed || this.state !== 'recording') return false;
    if (!(samples instanceof Float32Array)) {
      throw new TypeError('ASR 音频帧必须是 Float32Array。');
    }
    const expectedSampleRate = this.modelStatus && this.modelStatus.runtimeConfig
      ? this.modelStatus.runtimeConfig.sampleRate
      : 0;
    if (!Number.isInteger(sampleRate) || sampleRate !== expectedSampleRate) {
      throw new AsrServiceError(
        'ASR_SAMPLE_RATE_MISMATCH',
        `ASR 音频帧必须是 ${expectedSampleRate} Hz，实际为 ${sampleRate} Hz。`
      );
    }

    // Copy before transfer because Electron IPC owns the renderer-side buffer.
    // The worker is the only place that performs WASM inference.
    const transferableSamples = new Float32Array(samples);
    this.worker.postMessage(
      { type: 'audio', sampleRate, samples: transferableSamples },
      [transferableSamples.buffer]
    );
    return true;
  }

  onPartialResult(listener) {
    return this.subscribe('partial-result', listener);
  }

  onFinalResult(listener) {
    return this.subscribe('final-result', listener);
  }

  onStateChange(listener) {
    return this.subscribe('state-change', listener);
  }

  onVadState(listener) {
    return this.subscribe('vad-state', listener);
  }

  onRecordingLimit(listener) {
    return this.subscribe('recording-limit', listener);
  }

  subscribe(eventName, listener) {
    if (typeof listener !== 'function') throw new TypeError('ASR 事件监听器必须是函数。');
    this.on(eventName, listener);
    return () => this.off(eventName, listener);
  }

  async dispose() {
    if (this.isDisposed) return;
    this.isDisposed = true;

    try {
      if (this.worker) await this.request('dispose', {}, 10000);
    } catch (error) {
      // Termination below is still required when the worker has already failed.
    }

    const worker = this.worker;
    this.worker = null;
    this.rejectPendingRequests(new AsrServiceError('ASR_DISPOSED', 'ASR 服务已经释放。'));
    if (worker) await worker.terminate();
    this.setState('disposed');
    this.removeAllListeners();
  }

  ensureWorker() {
    if (this.worker) return;

    this.worker = new Worker(this.workerPath);
    this.worker.on('message', (message) => this.handleWorkerMessage(message));
    this.worker.on('error', (error) => this.handleWorkerFailure(error));
    this.worker.on('exit', (code) => {
      if (!this.isDisposed && code !== 0) {
        this.handleWorkerFailure(new AsrServiceError('ASR_WORKER_EXITED', `ASR Worker 异常退出（${code}）。`));
      }
    });
  }

  request(type, payload = {}, timeoutMs = 10000) {
    if (!this.worker) throw new AsrServiceError('ASR_WORKER_UNAVAILABLE', 'ASR Worker 不可用。');

    const requestId = `asr-${Date.now()}-${++this.requestSequence}`;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new AsrServiceError('ASR_WORKER_TIMEOUT', `ASR Worker 未及时响应 ${type}。`));
      }, timeoutMs);

      this.pendingRequests.set(requestId, { resolve, reject, timeout });
      this.worker.postMessage({ type, requestId, ...payload });
    });
  }

  handleWorkerMessage(message = {}) {
    if (message.type === 'response') {
      const pending = this.pendingRequests.get(message.requestId);
      if (!pending) return;
      this.pendingRequests.delete(message.requestId);
      clearTimeout(pending.timeout);

      if (message.ok) {
        pending.resolve(message.payload || {});
      } else {
        pending.reject(new AsrServiceError(
          message.error && message.error.code ? message.error.code : 'ASR_WORKER_ERROR',
          message.error && message.error.message ? message.error.message : 'ASR Worker 请求失败。'
        ));
      }
      return;
    }

    if (message.type !== 'event') return;
    if (message.event === 'partial') this.emit('partial-result', message.payload || {});
    if (message.event === 'final') this.emit('final-result', message.payload || {});
    if (message.event === 'vad') this.emit('vad-state', message.payload || {});
    if (message.event === 'limit') this.emit('recording-limit', message.payload || {});
    if (message.event === 'error') {
      const payload = message.payload || {};
      this.emit('asr-error', new AsrServiceError(
        payload.code || 'ASR_WORKER_ERROR',
        payload.message || 'ASR Worker 出现未知错误。'
      ));
    }
    if (message.event === 'state' && message.payload && message.payload.state) {
      this.setState(message.payload.state);
    }
  }

  handleWorkerFailure(error) {
    if (this.isDisposed) return;
    this.rejectPendingRequests(error instanceof Error ? error : new Error(String(error)));
    this.setState('error');
    this.emit('asr-error', error);
  }

  rejectPendingRequests(error) {
    this.pendingRequests.forEach((pending) => {
      clearTimeout(pending.timeout);
      pending.reject(error);
    });
    this.pendingRequests.clear();
  }

  setState(nextState) {
    if (this.state === nextState) return;
    this.state = nextState;
    this.emit('state-change', { state: nextState });
  }
}

function createAsrService(options) {
  return new AsrService(options);
}

module.exports = {
  AsrService,
  AsrServiceError,
  createAsrService
};
