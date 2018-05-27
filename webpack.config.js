const path = require('path');

module.exports = {
  entry: './dist/node/index.js',
  output: {
    filename: 'mock-cloud-firestore.js',
    path: path.resolve(__dirname, 'dist/browser'),
    library: 'MockFirebase',
  },
};
