/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: 'https://ds5zz9rfvzuta.cloudfront.net/',
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            name: 'processCSV.worker.js',
            publicPath: 'https://ds5zz9rfvzuta.cloudfront.net/',
          },
        },
      },
    ],
  },
});
