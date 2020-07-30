/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
    filename: '[chunkhash].min.js',
    https: true,
    disableHostCheck: true,
    hot: true,
  },
  output: {
    publicPath: '/',
  },
  plugins: [new BundleAnalyzerPlugin()],
});
