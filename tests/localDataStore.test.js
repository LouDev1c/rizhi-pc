const assert = require('assert/strict');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const {
  getStoragePaths,
  saveData,
  setStorageRoot
} = require('../src/storage/localDataStore');

(async () => {
  const testRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'rizhi-storage-test-'));
  const userData = path.join(testRoot, 'user-data');
  const appRoot = path.join(testRoot, 'app');
  const app = {
    isPackaged: false,
    getPath(name) {
      if (name !== 'userData') throw new Error(`Unexpected app path: ${name}`);
      return userData;
    },
    getAppPath() {
      return appRoot;
    }
  };

  try {
    const initialPaths = await getStoragePaths(app);
    const mediaRelativePath = '2026-09/2026-09-26/photo.jpg';
    const initialMediaFile = path.join(initialPaths.mediaDirectory, ...mediaRelativePath.split('/'));
    await fs.mkdir(path.dirname(initialMediaFile), { recursive: true });
    await fs.writeFile(initialMediaFile, 'media-one');
    const unrelatedFile = path.join(initialPaths.dataDirectory, 'keep-me.txt');
    await fs.writeFile(unrelatedFile, 'user-file');
    const nestedUnrelatedFile = path.join(initialPaths.dataDirectory, 'custom', 'nested', 'keep-too.txt');
    await fs.mkdir(path.dirname(nestedUnrelatedFile), { recursive: true });
    await fs.writeFile(nestedUnrelatedFile, 'nested-user-file');

    const data = {
      version: 2,
      tasks: [{ id: 'task-1', date: '2026-09-26', startTime: '09:00', endTime: '10:00', title: '测试任务' }],
      journals: [{
        id: 'journal-1',
        date: '2026-09-26',
        content: '测试记录',
        media: [{ id: 'media-1', kind: 'image', sourcePath: mediaRelativePath, mediaRoot: initialPaths.mediaDirectory }]
      }],
      profile: { classDuration: 50 }
    };
    await saveData(app, data);

    const nextStorageRoot = path.join(testRoot, 'migrated-root');
    const dataMigration = await setStorageRoot(app, nextStorageRoot, data);
    const migratedMediaRoot = path.join(nextStorageRoot, 'images');
    assert.equal(dataMigration.paths.storageRoot, nextStorageRoot);
    assert.equal(dataMigration.paths.dataDirectory, nextStorageRoot);
    assert.equal(dataMigration.paths.settingsFilePath, path.join(nextStorageRoot, 'rizhi-settings.json'));
    assert.equal(dataMigration.paths.settingsLocationPath, path.join(userData, 'rizhi-settings-location.json'));
    assert.equal(dataMigration.paths.mediaDirectory, migratedMediaRoot);
    assert.equal(dataMigration.data.journals[0].media[0].mediaRoot, migratedMediaRoot);
    assert.equal(await fs.readFile(path.join(migratedMediaRoot, ...mediaRelativePath.split('/')), 'utf8'), 'media-one');
    await assert.rejects(fs.access(initialMediaFile), /ENOENT/);
    await assert.rejects(fs.access(path.join(initialPaths.dataDirectory, 'rizhi-data-2026-09.json')), /ENOENT/);
    assert.equal(await fs.readFile(path.join(nextStorageRoot, 'keep-me.txt'), 'utf8'), 'user-file');
    assert.equal(await fs.readFile(path.join(nextStorageRoot, 'custom', 'nested', 'keep-too.txt'), 'utf8'), 'nested-user-file');
    await assert.rejects(fs.access(initialPaths.dataDirectory), /ENOENT/);

    const reloadedPaths = await getStoragePaths(app);
    assert.equal(reloadedPaths.storageRoot, nextStorageRoot);
    assert.equal(reloadedPaths.mediaDirectory, migratedMediaRoot);

    console.log('localDataStore migration tests passed');
  } finally {
    await fs.rm(testRoot, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
