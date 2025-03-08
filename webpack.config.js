const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "util": require.resolve("util/"),
      "os": require.resolve("os-browserify/browser"),
      "buffer": require.resolve("buffer/"),
      "path": require.resolve("path-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "fs": false
    }
  },
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
