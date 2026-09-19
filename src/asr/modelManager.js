'use strict';

const crypto = require('crypto');
const { execFile } = require('child_process');
const fsSync = require('fs');
const fs = require('fs/promises');
const https = require('https');
const path = require('path');
const { pipeline } = require('stream/promises');
const { promisify } = require('util');
const {
  ASR_MODEL_CONFIG,
  createModelRuntimePaths,
  getRequiredModelEntries,
  getUserDataModelDirectory,
  resolveModelDirectory
} = require('./asrModelConfig');

const execFileAsync = promisify(execFile);
const INSTALL_MANIFEST_FILE = '.rizhi-asr-model.json';
const TRUSTED_DOWNLOAD_HOSTS = new Set(['github.com', 'release-assets.githubusercontent.com']);

class AsrModelManagerError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = 'AsrModelManagerError';
    this.code = code;
    this.cause = cause;
  }
}

class AsrModelManager {
  constructor({ app, modelConfig = ASR_MODEL_CONFIG, developmentModelDirectory = '' } = {}) {
    if (!app || typeof app.getPath !== 'function') {
      throw new TypeError('AsrModelManager 需要一个 Electron app 实例。');
    }
    this.app = app;
    this.modelConfig = modelConfig;
    this.developmentModelDirectory = developmentModelDirectory;
    this.downloadPromise = null;
    this.downloadState = 'not-installed';
    this.downloadProgress = null;
    this.lastDownloadError = null;
  }

  getDirectoryInfo() {
    return resolveModelDirectory(this.app, {
      modelConfig: this.modelConfig,
      developmentModelDirectory: this.developmentModelDirectory
    });
  }

  getRuntimeConfig() {
    const directoryInfo = this.getDirectoryInfo();
    return {
      ...createModelRuntimePaths(directoryInfo.directory, this.modelConfig),
      directory: directoryInfo.directory,
      source: directoryInfo.source
    };
  }

  getDownloadDirectory() {
    return getUserDataModelDirectory(this.app, this.modelConfig);
  }

  async initialize() {
    return this.inspect();
  }

  async getStatus() {
    if (this.downloadState === 'downloading') return this.createStatusResponse({ isReady: false });
    await removeStaleDownloadDirectories(path.dirname(this.getDownloadDirectory()), this.modelConfig.modelId);
    return this.createStatusResponse(await this.inspect());
  }

  async inspect() {
    const directoryInfo = this.getDirectoryInfo();
    const validation = await validateModelDirectory(directoryInfo.directory, this.modelConfig, { verifyHashes: false });
    const isReady = validation.missingFiles.length === 0 && validation.invalidFiles.length === 0;
    return {
      isReady,
      directory: directoryInfo.directory,
      source: directoryInfo.source,
      modelId: this.modelConfig.modelId,
      modelVersion: this.modelConfig.modelVersion,
      missingFiles: [...validation.missingFiles, ...validation.invalidFiles],
      runtimeConfig: this.getRuntimeConfig()
    };
  }

  createStatusResponse(inspection = {}) {
    const directoryInfo = this.getDirectoryInfo();
    const source = inspection.source || directoryInfo.source;
    const state = this.downloadState === 'downloading'
      ? 'downloading'
      : inspection.isReady ? 'installed' : this.downloadState === 'failed' ? 'failed' : 'not-installed';
    return {
      state,
      isReady: Boolean(inspection.isReady),
      canDownload: source !== 'development',
      directory: inspection.directory || directoryInfo.directory,
      downloadDirectory: this.getDownloadDirectory(),
      source,
      modelId: this.modelConfig.modelId,
      modelVersion: this.modelConfig.modelVersion,
      downloadSizeBytes: this.modelConfig.download && this.modelConfig.download.displaySizeBytes,
      progress: this.downloadProgress,
      missingFiles: inspection.missingFiles || [],
      error: this.lastDownloadError ? serializeError(this.lastDownloadError) : null
    };
  }

  async download(onProgress) {
    if (this.downloadPromise) return this.downloadPromise;
    if (this.getDirectoryInfo().source === 'development') return this.getStatus();
    this.downloadPromise = this.downloadInternal(onProgress).finally(() => {
      this.downloadPromise = null;
    });
    return this.downloadPromise;
  }

  async downloadInternal(onProgress) {
    const current = await this.inspect();
    if (current.isReady) {
      this.downloadState = 'installed';
      this.lastDownloadError = null;
      return this.createStatusResponse(current);
    }

    const downloadConfig = this.modelConfig.download;
    if (!downloadConfig || !Array.isArray(downloadConfig.assets) || downloadConfig.assets.length === 0) {
      throw new AsrModelManagerError('ASR_DOWNLOAD_CONFIG_MISSING', 'ASR 模型缺少官方下载配置。');
    }

    const finalDirectory = getUserDataModelDirectory(this.app, this.modelConfig);
    const parentDirectory = path.dirname(finalDirectory);
    let stagingDirectory = '';
    this.downloadState = 'downloading';
    this.lastDownloadError = null;
    this.downloadProgress = { phase: 'preparing', downloadedBytes: 0, totalBytes: downloadConfig.displaySizeBytes || 0, percent: 0 };
    this.notifyProgress(onProgress, this.createStatusResponse({ isReady: false }));

    try {
      await fs.mkdir(parentDirectory, { recursive: true });
      await removeStaleDownloadDirectories(parentDirectory, this.modelConfig.modelId);
      stagingDirectory = await fs.mkdtemp(path.join(parentDirectory, `.${this.modelConfig.modelId}.downloading-`));
      const archiveAsset = downloadConfig.assets.find((asset) => asset.kind === 'archive');
      if (!archiveAsset) throw new AsrModelManagerError('ASR_DOWNLOAD_CONFIG_MISSING', 'ASR 模型下载配置缺少压缩模型包。');

      let completedBytes = 0;
      const totalBytes = downloadConfig.assets.reduce((sum, asset) => sum + Number(asset.sizeBytes || 0), 0);
      for (const asset of downloadConfig.assets) {
        const destination = asset.kind === 'archive'
          ? path.join(stagingDirectory, asset.fileName || 'model.tar.bz2')
          : path.join(stagingDirectory, asset.relativePath);
        await fs.mkdir(path.dirname(destination), { recursive: true });
        await downloadFile(asset.url, destination, (downloadedBytes, reportedTotalBytes) => {
          const knownTotal = totalBytes || reportedTotalBytes || 0;
          const cumulative = completedBytes + downloadedBytes;
          this.downloadProgress = {
            phase: 'downloading',
            downloadedBytes: cumulative,
            totalBytes: knownTotal,
            percent: knownTotal > 0 ? Math.min(100, Math.round((cumulative / knownTotal) * 1000) / 10) : null,
            currentFile: asset.kind === 'archive' ? '语音识别模型包' : '语音活动检测组件'
          };
          this.notifyProgress(onProgress, this.createStatusResponse({ isReady: false }));
        });
        completedBytes += Number(asset.sizeBytes || 0);
      }

      this.downloadProgress = { phase: 'extracting', downloadedBytes: completedBytes, totalBytes: completedBytes, percent: 100 };
      this.notifyProgress(onProgress, this.createStatusResponse({ isReady: false }));
      const archivePath = path.join(stagingDirectory, archiveAsset.fileName || 'model.tar.bz2');
      const extractedRoot = path.join(stagingDirectory, 'extracted');
      await fs.mkdir(extractedRoot, { recursive: true });
      await extractTarBz2(archivePath, extractedRoot);

      const extractedModelDirectory = path.join(extractedRoot, this.modelConfig.modelId);
      const initialValidation = await validateModelDirectory(extractedModelDirectory, this.modelConfig, { verifyHashes: false, ignoreMissing: ['silero_vad.onnx'] });
      if (initialValidation.missingFiles.length > 0 || initialValidation.invalidFiles.length > 0) {
        throw new AsrModelManagerError('ASR_ARCHIVE_INVALID', '下载的模型包解压后缺少所需文件。');
      }

      const vadAsset = downloadConfig.assets.find((asset) => asset.relativePath === 'silero_vad.onnx');
      if (!vadAsset) throw new AsrModelManagerError('ASR_DOWNLOAD_CONFIG_MISSING', 'ASR 模型下载配置缺少 VAD 文件。');
      await fs.copyFile(path.join(stagingDirectory, vadAsset.relativePath), path.join(extractedModelDirectory, vadAsset.relativePath));
      await fs.rm(path.join(extractedModelDirectory, 'test_wavs'), { recursive: true, force: true });
      await fs.rm(path.join(extractedModelDirectory, 'README.md'), { force: true });

      this.downloadProgress = { phase: 'verifying', downloadedBytes: completedBytes, totalBytes: completedBytes, percent: 100 };
      this.notifyProgress(onProgress, this.createStatusResponse({ isReady: false }));
      const verified = await validateModelDirectory(extractedModelDirectory, this.modelConfig, { verifyHashes: true });
      if (verified.missingFiles.length > 0 || verified.invalidFiles.length > 0) {
        throw new AsrModelManagerError('ASR_MODEL_CHECKSUM_FAILED', `模型完整性校验失败：${[...verified.missingFiles, ...verified.invalidFiles].join('、')}`);
      }

      await fs.writeFile(path.join(extractedModelDirectory, INSTALL_MANIFEST_FILE), JSON.stringify({
        modelId: this.modelConfig.modelId,
        modelVersion: this.modelConfig.modelVersion,
        installedAt: new Date().toISOString(),
        integrity: this.modelConfig.integrity
      }, null, 2), 'utf8');
      await promoteDirectory(extractedModelDirectory, finalDirectory);
      await fs.rm(stagingDirectory, { recursive: true, force: true }).catch(() => {});
      stagingDirectory = '';
      this.downloadState = 'installed';
      this.downloadProgress = null;
      this.lastDownloadError = null;
      const status = this.createStatusResponse(await this.inspect());
      this.notifyProgress(onProgress, status);
      return status;
    } catch (error) {
      this.downloadState = 'failed';
      this.downloadProgress = null;
      const wrapped = error instanceof AsrModelManagerError
        ? error
        : new AsrModelManagerError('ASR_MODEL_DOWNLOAD_FAILED', `下载或安装离线语音模型失败：${error.message || String(error)}`, error);
      this.lastDownloadError = wrapped;
      this.notifyProgress(onProgress, this.createStatusResponse({ isReady: false }));
      throw wrapped;
    } finally {
      if (stagingDirectory) await fs.rm(stagingDirectory, { recursive: true, force: true }).catch(() => {});
    }
  }

  notifyProgress(listener, payload) {
    if (typeof listener === 'function') listener(payload);
  }
}

async function validateModelDirectory(directory, modelConfig, { verifyHashes = false, ignoreMissing = [] } = {}) {
  const missingFiles = [];
  const invalidFiles = [];
  const ignored = new Set(ignoreMissing);
  for (const entry of getRequiredModelEntries(modelConfig)) {
    const filePath = path.join(directory, entry.relativePath);
    try {
      const stat = await fs.stat(filePath);
      if (entry.type === 'directory' ? !stat.isDirectory() : !stat.isFile()) missingFiles.push(entry.relativePath);
    } catch (error) {
      if (error && error.code === 'ENOENT' && !ignored.has(entry.relativePath)) missingFiles.push(entry.relativePath);
      else if (!error || error.code !== 'ENOENT') throw error;
    }
  }

  const integrityFiles = (modelConfig.integrity && modelConfig.integrity.files) || {};
  for (const [relativePath, expected] of Object.entries(integrityFiles)) {
    const filePath = path.join(directory, relativePath);
    try {
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) {
        invalidFiles.push(relativePath);
      } else if (Number.isFinite(expected.sizeBytes) && stat.size !== expected.sizeBytes) {
        invalidFiles.push(relativePath);
      } else if (verifyHashes && expected.sha256 && (await sha256File(filePath)) !== expected.sha256) {
        invalidFiles.push(relativePath);
      }
    } catch (error) {
      if (error && error.code === 'ENOENT' && !ignored.has(relativePath)) missingFiles.push(relativePath);
      else if (!error || error.code !== 'ENOENT') throw error;
    }
  }
  return { missingFiles: Array.from(new Set(missingFiles)), invalidFiles: Array.from(new Set(invalidFiles)) };
}

function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const input = fsSync.createReadStream(filePath);
    input.on('error', reject);
    input.on('data', (chunk) => hash.update(chunk));
    input.on('end', () => resolve(hash.digest('hex')));
  });
}

async function downloadFile(url, destination, onProgress, redirects = 0) {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'https:' || !TRUSTED_DOWNLOAD_HOSTS.has(parsedUrl.hostname)) {
    throw new AsrModelManagerError('ASR_DOWNLOAD_URL_UNTRUSTED', '模型下载地址不在受信任的官方域名列表中。');
  }
  if (redirects > 5) throw new AsrModelManagerError('ASR_DOWNLOAD_REDIRECT_FAILED', '模型下载重定向次数过多。');

  await new Promise((resolve, reject) => {
    const request = https.get(parsedUrl, { headers: { 'User-Agent': 'RiZhi-ASR-Model-Manager' } }, async (response) => {
      const statusCode = response.statusCode || 0;
      if ([301, 302, 303, 307, 308].includes(statusCode) && response.headers.location) {
        response.resume();
        try {
          await downloadFile(new URL(response.headers.location, parsedUrl).toString(), destination, onProgress, redirects + 1);
          resolve();
        } catch (error) {
          reject(error);
        }
        return;
      }
      if (statusCode !== 200) {
        response.resume();
        reject(new AsrModelManagerError('ASR_DOWNLOAD_HTTP_ERROR', `模型下载请求失败（HTTP ${statusCode}）。`));
        return;
      }
      const totalBytes = Number(response.headers['content-length'] || 0);
      let downloadedBytes = 0;
      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        onProgress(downloadedBytes, totalBytes);
      });
      try {
        await pipeline(response, fsSync.createWriteStream(destination, { flags: 'w' }));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    request.setTimeout(30000, () => request.destroy(new AsrModelManagerError('ASR_DOWNLOAD_TIMEOUT', '模型下载连接超时，请检查网络后重试。')));
    request.on('error', reject);
  });
}

async function extractTarBz2(archivePath, destination) {
  const tarCommand = process.platform === 'win32' ? 'tar.exe' : 'tar';
  try {
    await execFileAsync(tarCommand, ['-xjf', archivePath, '-C', destination], { windowsHide: true, maxBuffer: 1024 * 1024 });
  } catch (error) {
    throw new AsrModelManagerError('ASR_ARCHIVE_EXTRACT_FAILED', '无法解压语音模型包。请确认系统 tar 工具可用后重试。', error);
  }
}

async function promoteDirectory(stagedDirectory, finalDirectory) {
  const parentDirectory = path.dirname(finalDirectory);
  const backupDirectory = path.join(parentDirectory, `.${path.basename(finalDirectory)}.backup-${Date.now()}`);
  let backedUp = false;
  try {
    await fs.rename(finalDirectory, backupDirectory).then(() => { backedUp = true; }).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
    await fs.rename(stagedDirectory, finalDirectory);
    if (backedUp) await fs.rm(backupDirectory, { recursive: true, force: true });
  } catch (error) {
    if (backedUp) await fs.rename(backupDirectory, finalDirectory).catch(() => {});
    throw error;
  }
}

async function removeStaleDownloadDirectories(parentDirectory, modelId) {
  let entries = [];
  try {
    entries = await fs.readdir(parentDirectory, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === 'ENOENT') return;
    throw error;
  }
  const prefix = `.${modelId}.downloading-`;
  await Promise.all(entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
    .map((entry) => fs.rm(path.join(parentDirectory, entry.name), { recursive: true, force: true })));
}

function serializeError(error) {
  return {
    code: error && error.code ? error.code : 'ASR_MODEL_ERROR',
    message: error && error.message ? error.message : '语音模型操作失败。'
  };
}

function createAsrModelManager(options) {
  return new AsrModelManager(options);
}

module.exports = {
  AsrModelManager,
  AsrModelManagerError,
  createAsrModelManager
};
