/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(common, {
  mode: 'production',
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
    filename: '[chunkhash].min.js',
    https: false,
    disableHostCheck: true,
    inline: false,
  },
});
