/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const postCssFlexbugFixes = require('postcss-flexbugs-fixes');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssNano = require('cssnano');
const CopyWebpackPlugin = require('copy-webpack-plugin');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = {
  entry: ['@babel/polyfill', path.join(__dirname, 'src/index.js')],

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[hash].js',
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new OptimizeCssAssetsPlugin({ assetNameRegExp: /\.css$/g, cssProcessor: cssNano, cssProcessorOptions: { discardComments: { removeAll: true } }, canPrint: true }),
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      inject: 'body',
      inlineSource: '.(js|css)$',
    }),
    new MiniCssExtractPlugin({ filename: '[hash].css' }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(__dirname, '/src/assets/images/'), to: 'images/' }, { from: path.join(__dirname, '/src/favicon.ico') }],
      options: { concurrency: 100 },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
              reloadAll: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => [postCssFlexbugFixes],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(png)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
  },

  resolve: {
    alias: {
      '/images/logo_circle.png': path.resolve(__dirname, 'src/assets/images/logo_circle.png'),
      '/images/logo_circle_only.png': path.resolve(__dirname, 'src/assets/images/logo_circle_only.png'),
      react$: path.resolve(__dirname, 'node_modules/react/cjs/react.production.min.js'),
      'react-dom$': path.resolve(__dirname, 'node_modules/react-dom/cjs/react-dom.production.min.js'),
    },
  },
};
