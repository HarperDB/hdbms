/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: 'https://dbjxbnqel2bw9.cloudfront.net',
  },
});
