var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './test/api.Test.js',
  output: { path: __dirname, filename: './test/bundle.js' },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};
