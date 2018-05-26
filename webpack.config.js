const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'mock-cloud-firestore.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'MockFirebase',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: ["transform-async-to-generator"]
                }
            }
        }]
    }
};