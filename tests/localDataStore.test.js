const assert = require('assert/strict');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const {
  getStoragePaths,
  saveData,
  setMediaDirectory,
  setStorageDirectory
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

    const nextDataDirectory = path.join(testRoot, 'migrated-data');
    const dataMigration = await setStorageDirectory(app, nextDataDirectory, data);
    const migratedMediaRoot = path.join(nextDataDirectory, 'images');
    assert.equal(dataMigration.paths.dataDirectory, nextDataDirectory);
    assert.equal(dataMigration.data.journals[0].media[0].mediaRoot, migratedMediaRoot);
    assert.equal(await fs.readFile(path.join(migratedMediaRoot, ...mediaRelativePath.split('/')), 'utf8'), 'media-one');
    await assert.rejects(fs.access(initialMediaFile), /ENOENT/);
    await assert.rejects(fs.access(path.join(initialPaths.dataDirectory, 'rizhi-data-2026-09.json')), /ENOENT/);
    assert.equal(await fs.readFile(unrelatedFile, 'utf8'), 'user-file');

    const secondRelativePath = '2026-10/2026-10-01/photo-two.jpg';
    const secondSource = path.join(migratedMediaRoot, ...secondRelativePath.split('/'));
    await fs.mkdir(path.dirname(secondSource), { recursive: true });
    await fs.writeFile(secondSource, 'media-two');
    const dataWithSecondMedia = {
      ...dataMigration.data,
      journals: dataMigration.data.journals.map((journal) => ({
        ...journal,
        media: [...journal.media, {
          id: 'media-2',
          kind: 'image',
          sourcePath: secondRelativePath,
          mediaRoot: migratedMediaRoot
        }]
      }))
    };
    await saveData(app, dataWithSecondMedia);

    const nextMediaDirectory = path.join(testRoot, 'migrated-media');
    const mediaMigration = await setMediaDirectory(app, nextMediaDirectory, dataWithSecondMedia);
    assert.equal(mediaMigration.paths.mediaDirectory, nextMediaDirectory);
    assert.ok(mediaMigration.data.journals[0].media.every((item) => item.mediaRoot === nextMediaDirectory));
    assert.equal(await fs.readFile(path.join(nextMediaDirectory, ...secondRelativePath.split('/')), 'utf8'), 'media-two');
    await assert.rejects(fs.access(secondSource), /ENOENT/);

    console.log('localDataStore migration tests passed');
  } finally {
    await fs.rm(testRoot, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
