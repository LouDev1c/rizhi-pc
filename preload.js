const { contextBridge, ipcRenderer, webUtils } = require('electron');

function subscribeToAsrEvent(channel, listener) {
  if (typeof listener !== 'function') throw new TypeError('ASR 事件监听器必须是函数。');
  const wrappedListener = (_event, payload) => listener(payload || {});
  ipcRenderer.on(channel, wrappedListener);
  return () => ipcRenderer.removeListener(channel, wrappedListener);
}

contextBridge.exposeInMainWorld('whbr', {
  getAppIconUrl: () => ipcRenderer.invoke('app:getIconUrl'),
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  getSystemTime: () => ipcRenderer.invoke('system:getTime'),
  parseTaskText: (text, referenceDate) => ipcRenderer.invoke('task:parseText', { text, referenceDate }),
  showMessageBox: (options) => ipcRenderer.invoke('dialog:messageBox', options),
  selectAndParseFile: (options) => ipcRenderer.invoke('file:selectAndParse', options),
  parseFilePath: (filePath) => ipcRenderer.invoke('file:parsePath', filePath),
  loadData: () => ipcRenderer.invoke('data:load'),
  saveData: (data) => ipcRenderer.invoke('data:save', data),
  getStoragePaths: () => ipcRenderer.invoke('data:getPaths'),
  chooseDataPath: (data) => ipcRenderer.invoke('data:choosePath', data),
  openDataPath: () => ipcRenderer.invoke('data:openDirectory'),
  resetData: () => ipcRenderer.invoke('data:reset'),
  showReminder: (payload) => ipcRenderer.invoke('notify:show', payload),
  asr: {
    getModelStatus: () => ipcRenderer.invoke('asr:modelStatus'),
    downloadModel: () => ipcRenderer.invoke('asr:downloadModel'),
    openModelDirectory: () => ipcRenderer.invoke('asr:openModelDirectory'),
    initialize: () => ipcRenderer.invoke('asr:initialize'),
    start: () => ipcRenderer.invoke('asr:start'),
    stop: () => ipcRenderer.invoke('asr:stop'),
    cancel: () => ipcRenderer.invoke('asr:cancel'),
    sendAudioFrame: (sampleRate, samples) => {
      if (!Number.isInteger(sampleRate) || !(samples instanceof Float32Array)) {
        throw new TypeError('ASR 音频帧必须是带采样率的 Float32Array。');
      }
      const copy = samples.buffer.slice(samples.byteOffset, samples.byteOffset + samples.byteLength);
      ipcRenderer.send('asr:audio', { sampleRate, samples: copy });
    },
    onPartialResult: (listener) => subscribeToAsrEvent('asr:partial', listener),
    onFinalResult: (listener) => subscribeToAsrEvent('asr:final', listener),
    onVadState: (listener) => subscribeToAsrEvent('asr:vad', listener),
    onRecordingLimit: (listener) => subscribeToAsrEvent('asr:limit', listener),
    onModelStatus: (listener) => subscribeToAsrEvent('asr:model-status', listener),
    onError: (listener) => subscribeToAsrEvent('asr:error', listener)
  },
  getPathForFile: (file) => {
    if (webUtils && typeof webUtils.getPathForFile === 'function') {
      return webUtils.getPathForFile(file);
    }

    return file.path || '';
  }
});
