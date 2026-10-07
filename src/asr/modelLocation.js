'use strict';

const crypto = require('crypto');
const fsSync = require('fs');
const fs = require('fs/promises');
const path = require('path');

// Separate from task/journal settings: changing their save location cannot lose
// the model location. This small file remains in userData across app updates.
function getLocationFile(app) {
  return path.join(app.getPath('userData'), 'asr-model-location.json');
}

function readLocations(app) {
  try {
    const data = JSON.parse(fsSync.readFileSync(getLocationFile(app), 'utf8'));
    if (!data || typeof data !== 'object' || !data.directories || typeof data.directories !== 'object') {
      throw new Error('模型路径配置格式无效。');
    }
    return data;
  } catch (error) {
    if (error.code === 'ENOENT') return { directories: {} };
    throw new Error(`无法读取模型路径配置：${error.message}`);
  }
}

function readModelLocation(app, modelId) {
  const directory = readLocations(app).directories[modelId];
  if (!directory) return '';
  assertModelDirectory(directory, modelId);
  return path.resolve(directory);
}

async function writeModelLocation(app, modelId, directory) {
  assertModelDirectory(directory, modelId);
  const data = readLocations(app);
  data.directories[modelId] = directory;
  const file = getLocationFile(app);
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temporaryFile = `${file}.${crypto.randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporaryFile, JSON.stringify(data, null, 2), { encoding: 'utf8', flag: 'wx' });
    await fs.rename(temporaryFile, file);
  } finally {
    await fs.rm(temporaryFile, { force: true }).catch(() => {});
  }
}

function assertModelDirectory(directory, modelId) {
  if (typeof directory !== 'string' || !path.isAbsolute(directory)
      || path.basename(directory) !== modelId || path.resolve(directory) === path.parse(directory).root) {
    throw new Error('模型路径必须是以模型 ID 命名的专用目录，不能是磁盘根目录。');
  }
}

function pathsOverlap(first, second) {
  const contains = (parent, child) => {
    const relative = path.relative(parent, child);
    return !relative || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
  };
  return contains(first, second) || contains(second, first);
}

async function statIfExists(directory) {
  try { return await fs.lstat(directory); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

function hashFile(file) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fsSync.createReadStream(file);
    stream.on('error', reject);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

async function copyVerifiedDirectory(source, target) {
  await fs.mkdir(target, { recursive: true });
  for (const entry of await fs.readdir(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    // Never follow links or remove their targets during model migration.
    if (entry.isDirectory()) await copyVerifiedDirectory(from, to);
    else if (entry.isFile()) {
      await fs.copyFile(from, to, fsSync.constants.COPYFILE_EXCL);
      const [originalHash, copiedHash] = await Promise.all([hashFile(from), hashFile(to)]);
      if (originalHash !== copiedHash) throw new Error(`迁移文件校验失败：${entry.name}`);
    } else throw new Error(`模型目录包含不支持迁移的链接或特殊文件：${entry.name}`);
  }
}

// Copy + verify works across drives. Persist only after promotion; until then
// the old model remains untouched and is still the active installation.
async function migrateModelDirectory({ app, modelId, source, selectedParent, validate }) {
  assertModelDirectory(source, modelId);
  if (!path.isAbsolute(selectedParent)) throw new Error('请选择绝对路径的模型存放文件夹。');
  await fs.mkdir(selectedParent, { recursive: true });
  const parent = await fs.realpath(selectedParent);
  const destination = path.join(parent, modelId);
  assertModelDirectory(destination, modelId);
  const sourceStat = await statIfExists(source);
  if (sourceStat && (!sourceStat.isDirectory() || sourceStat.isSymbolicLink())) {
    throw new Error('原模型路径不是普通目录，不能自动迁移。');
  }
  const resolvedSource = sourceStat ? await fs.realpath(source) : path.resolve(source);
  assertModelDirectory(resolvedSource, modelId);
  if (path.relative(resolvedSource, destination) === '') return { directory: source, unchanged: true };
  if (pathsOverlap(resolvedSource, destination)) throw new Error('新旧模型目录不能互相包含。');
  const targetStat = await statIfExists(destination);
  if (targetStat && (!targetStat.isDirectory() || targetStat.isSymbolicLink() || (await fs.readdir(destination)).length)) {
    throw new Error('目标模型目录已包含文件，请选择其他文件夹；不会覆盖已有内容。');
  }

  let staging = '';
  let promoted = false;
  let saved = false;
  try {
    staging = await fs.mkdtemp(path.join(parent, `.${modelId}.migrating-`));
    if (sourceStat) await copyVerifiedDirectory(source, staging);
    if (validate) await validate(staging);
    // rmdir only removes an empty target, never an existing populated folder.
    if (targetStat) await fs.rmdir(destination);
    await fs.rename(staging, destination);
    staging = '';
    promoted = true;
    await writeModelLocation(app, modelId, destination);
    saved = true;
  } finally {
    if (staging) await fs.rm(staging, { recursive: true, force: true }).catch(() => {});
    // Only remove the exact directory created by this attempt before commit.
    if (promoted && !saved) await fs.rm(destination, { recursive: true, force: true }).catch(() => {});
  }

  let cleanupWarning = '';
  if (sourceStat) {
    assertModelDirectory(resolvedSource, modelId);
    try { await fs.rm(resolvedSource, { recursive: true }); }
    catch (error) { cleanupWarning = `新路径已生效，但旧模型目录未能清理：${source}（${error.message}）。可退出软件后手动清理。`; }
  }
  return { directory: destination, migrated: Boolean(sourceStat), cleanupWarning };
}

module.exports = { readModelLocation, migrateModelDirectory };
