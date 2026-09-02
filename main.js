const { app, BrowserWindow, Menu, Tray, dialog, ipcMain, nativeImage, screen } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const { parseScheduleFile } = require('./src/parsers/scheduleParser');
const { parseScheduleImage } = require('./src/parsers/imageScheduleParser');
const { getStoragePaths, loadData, resetData, saveData, setDataPath, setSettingsPath } = require('./src/storage/localDataStore');

const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.csv', '.tsv', '.xlsx', '.xls']);
const appIconPath = path.join(__dirname, 'rizhi.ico');
let mainWindow = null;
let reminderWindow = null;
let reminderCloseTimer = null;
let reminderQueue = [];
let isReminderShowing = false;
let tray = null;
let isQuitting = false;

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
    title: 'RiZhi',
    icon: appIconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    hideMainWindow();
  });

  mainWindow.on('close', (event) => {
    if (isQuitting) return;
    event.preventDefault();
    hideMainWindow();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

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
  tray.setToolTip('RiZhi');
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: '打开 RiZhi',
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
  return image.resize({ width: 16, height: 16 });
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
  const title = escapeHtml(payload.title || 'RiZhi 提醒');
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

ipcMain.handle('file:selectAndParse', async () => {
  const result = await dialog.showOpenDialog({
    title: '选择课表图片或表格文件',
    properties: ['openFile'],
    filters: [
      { name: '课表图片或表格', extensions: ['png', 'jpg', 'jpeg', 'csv', 'tsv', 'xlsx', 'xls'] },
      { name: '图片', extensions: ['png', 'jpg', 'jpeg'] },
      { name: '表格', extensions: ['csv', 'tsv', 'xlsx', 'xls'] }
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
    title: '选择 RiZhi 月度数据文件夹',
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
    title: '选择 RiZhi 设置文件保存位置',
    defaultPath: 'rizhi-settings.json',
    filters: [
      { name: 'RiZhi 设置文件', extensions: ['json'] },
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
      error: '暂不支持该文件类型',
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

  if (['.png', '.jpg', '.jpeg'].includes(ext)) {
    const visionResult = await parseScheduleImage(filePath);
    return {
      ...basePayload,
      sourceType: 'image',
      ...visionResult
    };
  }

  const parseResult = await parseScheduleFile(filePath);
  return {
    ...basePayload,
    sourceType: 'table',
    ...parseResult
  };
}
