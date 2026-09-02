const path = require('path');

try {
  Object.defineProperty(process.versions, 'electron', {
    value: undefined,
    configurable: true
  });
} catch (error) {
  // If Electron keeps the field locked,
  // Tesseract will fall back to its own handling.
}

const tesseractEntry = require.resolve('tesseract.js');

const workerScript = path.join(
  path.dirname(tesseractEntry),
  'worker-script',
  'node',
  'index.js'
);

require(workerScript);