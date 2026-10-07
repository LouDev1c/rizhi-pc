'use strict';

const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { ASR_MODEL_CONFIG } = require('../src/asr/asrModelConfig');
const { createAsrModelManager } = require('../src/asr/modelManager');

(async () => {
  // Small stand-in files exercise the actual migration code without downloading
  // a model, loading WASM, or touching real userData/model files.
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rizhi-asr-migration-test-'));
  const content = 'fixture model';
  const config = {
    ...ASR_MODEL_CONFIG,
    modelId: 'test-asr-model',
    files: { encoder: { relativePath: 'encoder.onnx', type: 'file' } },
    integrity: { files: { 'encoder.onnx': {
      sizeBytes: Buffer.byteLength(content),
      sha256: crypto.createHash('sha256').update(content).digest('hex')
    } } }
  };
  function appFor(name) {
    return { isPackaged: true, getPath: () => path.join(root, name) };
  }
  function managerFor(app) { return createAsrModelManager({ app, modelConfig: config }); }
  async function install(manager, text = content) {
    const directory = manager.getDownloadDirectory();
    await fs.mkdir(path.join(directory, 'extra'), { recursive: true });
    await fs.writeFile(path.join(directory, 'encoder.onnx'), text);
    await fs.writeFile(path.join(directory, 'extra', 'keep.txt'), 'keep all contents');
    return directory;
  }
  try {
    const app = appFor('installed');
    const manager = managerFor(app);
    const original = await install(manager);
    const untouched = path.join(app.getPath('userData'), 'tasks-and-settings.json');
    await fs.writeFile(untouched, 'unchanged');
    const parent = path.join(root, 'new-models');
    const target = path.join(parent, config.modelId);
    const result = await manager.changeDirectory(parent);
    assert.equal(result.modelStatus.isReady, true);
    assert.equal(result.modelStatus.downloadDirectory, target);
    assert.equal(result.modelStatus.source, 'custom');
    assert.equal(result.cleanupWarning, '');
    assert.equal(await fs.readFile(path.join(target, 'extra', 'keep.txt'), 'utf8'), 'keep all contents');
    await assert.rejects(fs.access(original), /ENOENT/);
    assert.equal(await fs.readFile(untouched, 'utf8'), 'unchanged');
    const restarted = managerFor(app);
    assert.equal(restarted.getDownloadDirectory(), target);
    assert.equal(restarted.getRuntimeConfig().files.encoder, path.join(target, 'encoder.onnx'));
    assert.equal((await restarted.inspect()).isReady, true);
    assert.equal((await restarted.changeDirectory(parent)).unchanged, true);

    // Move a second time, proving the remembered source is used, not userData.
    const second = await restarted.changeDirectory(path.join(root, 'second-models'));
    assert.equal(second.modelStatus.isReady, true);
    await assert.rejects(fs.access(target), /ENOENT/);

    // Future downloads must use the chosen directory even before installation.
    const emptyApp = appFor('not-installed');
    const empty = managerFor(emptyApp);
    const emptyResult = await empty.changeDirectory(path.join(root, 'future-downloads'));
    assert.equal(emptyResult.migrated, false);
    assert.equal(emptyResult.modelStatus.state, 'not-installed');
    assert.equal(managerFor(emptyApp).getDownloadDirectory(), emptyResult.directory);

    const conflictApp = appFor('conflict');
    const conflict = managerFor(conflictApp);
    const conflictSource = await install(conflict);
    const occupiedParent = path.join(root, 'occupied');
    await fs.mkdir(path.join(occupiedParent, config.modelId), { recursive: true });
    await fs.writeFile(path.join(occupiedParent, config.modelId, 'user-file.txt'), 'do not overwrite');
    await assert.rejects(conflict.changeDirectory(occupiedParent), /不会覆盖/);
    assert.equal(conflict.getDownloadDirectory(), conflictSource);
    assert.equal(await fs.readFile(path.join(occupiedParent, config.modelId, 'user-file.txt'), 'utf8'), 'do not overwrite');
    await assert.rejects(conflict.changeDirectory(conflictSource), /不能互相包含/);
    conflict.downloadPromise = Promise.resolve();
    await assert.rejects(conflict.changeDirectory(parent), /正在下载或迁移/);
    conflict.downloadPromise = null;

    // A same-size corrupted model passes size inspection but must fail SHA-256
    // migration validation. Old files/location survive, staging is removed.
    const corruptApp = appFor('corrupt');
    const corrupt = managerFor(corruptApp);
    const corruptSource = await install(corrupt, 'x'.repeat(Buffer.byteLength(content)));
    const corruptParent = path.join(root, 'corrupt-target');
    await assert.rejects(corrupt.changeDirectory(corruptParent), /完整性校验失败/);
    assert.equal(corrupt.getDownloadDirectory(), corruptSource);
    assert.equal((await fs.readdir(corruptParent)).length, 0);
    assert.equal((await fs.stat(corruptSource)).isDirectory(), true);

    // Persistence failure after promotion must roll back the newly copied model.
    const failureApp = appFor('settings-failure');
    const failure = managerFor(failureApp);
    const failureSource = await install(failure);
    await fs.writeFile(path.join(failureApp.getPath('userData'), 'asr-model-location.json'), 'invalid json');
    const failureParent = path.join(root, 'settings-failure-target');
    await assert.rejects(failure.changeDirectory(failureParent), /无法读取模型路径配置/);
    assert.equal(failure.getDownloadDirectory(), failureSource);
    assert.equal((await fs.readdir(failureParent)).length, 0);
    assert.equal((await fs.stat(failureSource)).isDirectory(), true);
    console.log('ASR model migration tests passed.');
  } finally {
    // Exact mkdtemp-created test root only; never uses real userData.
    await fs.rm(root, { recursive: true, force: true });
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
