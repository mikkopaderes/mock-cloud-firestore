const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'mock-cloud-firestore.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MockFirebase',
  },
};
