const { app, BrowserWindow, Menu, Tray, dialog, ipcMain, nativeImage, screen } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const fsSync = require('fs');
const fs = require('fs/promises');
const { parseScheduleFile } = require('./src/parsers/scheduleParser');
const { getStoragePaths, loadData, resetData, saveData, setDataPath, setSettingsPath } = require('./src/storage/localDataStore');
const { autoUpdater } = require('electron-updater');

const scheduleFileExtensions = ['xlsx', 'xls', 'csv', 'tsv'];
const allowedExtensions = new Set(scheduleFileExtensions.map((extension) => `.${extension}`));
const appIconPath = resolveAppIconPath();
let mainWindow = null;
let reminderWindow = null;
let reminderCloseTimer = null;
let reminderQueue = [];
let isReminderShowing = false;
let tray = null;
let isQuitting = false;
let isClosePromptShowing = false;
let isUpdatePromptShowing = false;

if (process.platform === 'win32') {
  app.setAppUserModelId('com.rizhi.pc');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 920,
    minHeight: 620,
    backgroundColor: '#f4f5f7',
    title: '日织',
    icon: appIconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.on('close', async (event) => {
    if (isQuitting) return;
    event.preventDefault();

    if (isClosePromptShowing) return;
    isClosePromptShowing = true;

    const choice = await dialog.showMessageBox(mainWindow, {
      type: 'question',
      title: '关闭日织',
      message: '要退出软件，还是最小化到托盘继续运行？',
      buttons: ['最小化到托盘', '退出软件', '取消'],
      defaultId: 0,
      cancelId: 2,
      noLink: true
    });

    isClosePromptShowing = false;

    if (choice.response === 1) {
      isQuitting = true;
      app.quit();
      return;
    }

    if (choice.response === 0) {
      hideMainWindow();
    }
  });
}

function setupAutoUpdater() {
  if (!app.isPackaged) {
    return;
  }

  autoUpdater.autoDownload = false;

  autoUpdater.on('checking-for-update', () => {
    console.log('RiZhi: checking for updates...');
  });

  autoUpdater.on('update-available', async (info) => {
    const versionLabel = formatVersionLabel(info.version);
    console.log(`RiZhi: update available: ${versionLabel}`);

    if (isUpdatePromptShowing) return;
    isUpdatePromptShowing = true;

    const result = await dialog.showMessageBox(mainWindow || undefined, {
      type: 'question',
      title: '日织更新',
      message: `有新版本${versionLabel}，是否更新？`,
      detail: '选择“是”后将从 GitHub Release 下载并安装新版本。选择“否”会继续使用当前版本，且不会处理你的本地记录文件。',
      buttons: ['是', '否'],
      defaultId: 0,
      cancelId: 1,
      noLink: true
    });

    isUpdatePromptShowing = false;

    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('update-not-available', () => {
    console.log('RiZhi: already up to date.');
  });

  autoUpdater.on('download-progress', (progress) => {
    console.log(
      `RiZhi: update download ${progress.percent.toFixed(1)}%`
    );
  });

  autoUpdater.on('update-downloaded', async (info) => {
    const versionLabel = formatVersionLabel(info.version);
    await dialog.showMessageBox(mainWindow || undefined, {
      type: 'info',
      title: '日织更新',
      message: `新版本 ${versionLabel} 已下载完成`,
      detail: '日织将重启并完成更新。',
      buttons: ['立即更新'],
      defaultId: 0,
      cancelId: 0,
      noLink: true
    });

    isQuitting = true;
    autoUpdater.quitAndInstall(false, true);
  });

  autoUpdater.on('error', (error) => {
    console.error('RiZhi updater error:', error);
  });

  autoUpdater.checkForUpdates();
}

function formatVersionLabel(version) {
  const text = String(version || '').trim();
  return text.startsWith('v') ? text : `v${text}`;
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  setupAutoUpdater();

  app.on('activate', () => {
    if (!mainWindow || mainWindow.isDestroyed()) createWindow();
    showMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (isQuitting && process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  isQuitting = true;
});

function createTray() {
  if (tray) return;

  tray = new Tray(createTrayIcon());
  tray.setToolTip('日织');
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: '打开日织',
      click: showMainWindow
    },
    {
      label: '退出',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]));
  tray.on('click', showMainWindow);
  tray.on('double-click', showMainWindow);
  tray.on('balloon-click', showMainWindow);
}

function createTrayIcon() {
  const image = nativeImage.createFromPath(appIconPath);
  return image.isEmpty() ? nativeImage.createEmpty() : image.resize({ width: 16, height: 16 });
}

function resolveAppIconPath() {
  const candidates = [
    path.join(__dirname, 'rizhi.ico'),
    path.join(process.resourcesPath || '', 'rizhi.ico')
  ];

  return candidates.find((candidate) => candidate && fsSync.existsSync(candidate)) || candidates[0];
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
  }

  mainWindow.show();
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
}

function hideMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.hide();
}

function showDesktopReminder(payload = {}) {
  reminderQueue.push(payload);
  if (!isReminderShowing) {
    showNextDesktopReminder();
  }
}

function showNextDesktopReminder() {
  const payload = reminderQueue.shift();
  if (!payload) {
    isReminderShowing = false;
    return;
  }

  isReminderShowing = true;
  displayDesktopReminder(payload);
}

function displayDesktopReminder(payload = {}) {
  const title = escapeHtml(payload.title || '日织提醒');
  const body = escapeHtml(payload.body || '');
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;
  const { x, y } = display.workArea;
  const windowWidth = 360;
  const windowHeight = 128;
  const margin = 18;

  if (reminderWindow && !reminderWindow.isDestroyed()) {
    reminderWindow.close();
  }

  reminderWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: x + width - windowWidth - margin,
    y: y + height - windowHeight - margin,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    focusable: true,
    backgroundColor: '#00000000',
    transparent: true,
    webPreferences: {
      backgroundThrottling: false
    }
  });

  reminderWindow.setAlwaysOnTop(true, 'screen-saver');
  reminderWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  reminderWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(createReminderHtml(title, body))}`);
  reminderWindow.webContents.once('did-finish-load', () => {
    if (!reminderWindow || reminderWindow.isDestroyed()) return;
    reminderWindow.setAlwaysOnTop(true, 'screen-saver');
    reminderWindow.showInactive();
    reminderWindow.moveTop();
  });
  reminderWindow.on('closed', () => {
    reminderWindow = null;
    clearTimeout(reminderCloseTimer);
    reminderCloseTimer = null;
    setTimeout(showNextDesktopReminder, 450);
  });

  clearTimeout(reminderCloseTimer);
  reminderCloseTimer = setTimeout(() => {
    if (reminderWindow && !reminderWindow.isDestroyed()) {
      reminderWindow.close();
    }
  }, 10000);
}

function createReminderHtml(title, body) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
      background: transparent;
      font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
      color: #18212b;
    }
    button {
      width: 100%;
      height: 100%;
      padding: 16px 18px;
      border: 1px solid #bed8ca;
      border-left: 6px solid #1f7a57;
      border-radius: 12px;
      background: #f2fbf6;
      box-shadow: 0 18px 45px rgba(19, 35, 49, 0.18);
      text-align: left;
      color: inherit;
      cursor: pointer;
    }
    strong {
      display: block;
      font-size: 17px;
      line-height: 1.35;
      margin-bottom: 8px;
    }
    p {
      margin: 0;
      font-size: 15px;
      line-height: 1.5;
      color: #405062;
    }
  </style>
</head>
<body>
  <button onclick="window.close()" title="点击关闭提醒">
    <strong>${title}</strong>
    <p>${body}</p>
  </button>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

ipcMain.handle('system:getTime', () => {
  const now = new Date();
  return {
    iso: now.toISOString(),
    local: now.toLocaleString('zh-CN', { hour12: false }),
    timestamp: now.getTime()
  };
});

ipcMain.handle('app:getIconUrl', () => {
  return pathToFileURL(appIconPath).toString();
});

ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

ipcMain.handle('dialog:messageBox', async (_event, options = {}) => {
  return dialog.showMessageBox(mainWindow || undefined, {
    type: options.type || 'question',
    title: options.title || '日织',
    message: options.message || '',
    detail: options.detail || '',
    buttons: Array.isArray(options.buttons) && options.buttons.length ? options.buttons : ['确定'],
    defaultId: Number.isInteger(options.defaultId) ? options.defaultId : 0,
    cancelId: Number.isInteger(options.cancelId) ? options.cancelId : 0,
    noLink: options.noLink !== false
  });
});

ipcMain.handle('file:selectAndParse', async (_event, options = {}) => {
  const extensions = scheduleFileExtensions;
  const result = await dialog.showOpenDialog({
    title: '选择课表文件',
    properties: ['openFile'],
    filters: [
      { name: '课表文件', extensions },
      { name: '表格文件', extensions }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  const filePath = result.filePaths[0];
  const stat = await fs.stat(filePath);
  return {
    canceled: false,
    filePath,
    fileName: path.basename(filePath),
    fileSize: stat.size
  };
});

ipcMain.handle('file:parsePath', async (_event, filePath) => {
  return parseSelectedFile(filePath);
});

ipcMain.handle('data:load', async () => {
  return loadData(app);
});

ipcMain.handle('data:save', async (_event, data) => {
  return saveData(app, data);
});

ipcMain.handle('data:getPaths', async () => {
  return getStoragePaths(app);
});

ipcMain.handle('data:choosePath', async (_event, data) => {
  const result = await dialog.showOpenDialog({
    title: '选择日织月度数据文件夹',
    properties: ['openDirectory', 'createDirectory']
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  return {
    canceled: false,
    ...(await setDataPath(app, result.filePaths[0], data))
  };
});

ipcMain.handle('data:chooseSettingsPath', async (_event, data) => {
  const result = await dialog.showSaveDialog({
    title: '选择日织设置文件保存位置',
    defaultPath: 'rizhi-settings.json',
    filters: [
      { name: '日织设置文件', extensions: ['json'] },
      { name: 'JSON', extensions: ['json'] }
    ]
  });

  if (result.canceled || !result.filePath) {
    return { canceled: true };
  }

  return {
    canceled: false,
    ...(await setSettingsPath(app, result.filePath, data))
  };
});

ipcMain.handle('data:reset', async () => {
  return resetData(app);
});

ipcMain.handle('notify:show', (_event, payload = {}) => {
  showDesktopReminder(payload);
  return { ok: true };
});

async function parseSelectedFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (!allowedExtensions.has(ext)) {
    return {
      canceled: false,
      error: '暂不支持该文件类型，请选择 xlsx、xls、csv 或 tsv 表格文件。',
      filePath,
      tasks: []
    };
  }

  const stat = await fs.stat(filePath);
  const basePayload = {
    canceled: false,
    filePath,
    fileName: path.basename(filePath),
    fileSize: stat.size,
    importedAt: new Date().toISOString()
  };

  const parseResult = await parseScheduleFile(filePath);
  return {
    ...basePayload,
    sourceType: 'table',
    ...parseResult
  };
}
