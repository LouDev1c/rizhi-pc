const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('whbr', {
  getSystemTime: () => ipcRenderer.invoke('system:getTime'),
  selectAndParseFile: () => ipcRenderer.invoke('file:selectAndParse'),
  parseFilePath: (filePath) => ipcRenderer.invoke('file:parsePath', filePath),
  loadData: () => ipcRenderer.invoke('data:load'),
  saveData: (data) => ipcRenderer.invoke('data:save', data),
  getStoragePaths: () => ipcRenderer.invoke('data:getPaths'),
  chooseDataPath: (data) => ipcRenderer.invoke('data:choosePath', data),
  chooseSettingsPath: (data) => ipcRenderer.invoke('data:chooseSettingsPath', data),
  resetData: () => ipcRenderer.invoke('data:reset'),
  showReminder: (payload) => ipcRenderer.invoke('notify:show', payload),
  getPathForFile: (file) => {
    if (webUtils && typeof webUtils.getPathForFile === 'function') {
      return webUtils.getPathForFile(file);
    }

    return file.path || '';
  }
});
