try {
  Object.defineProperty(process.versions, 'electron', {
    value: undefined,
    configurable: true
  });
} catch (error) {
  // If Electron keeps the field locked, Tesseract will fall back to its own handling.
}

require('../../node_modules/tesseract.js/src/worker-script/node/index.js');
