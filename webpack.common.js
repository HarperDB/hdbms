/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const postCssFlexbugFixes = require('postcss-flexbugs-fixes');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssNano = require('cssnano');
const CopyWebpackPlugin = require('copy-webpack-plugin');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = {
  entry: ['@babel/polyfill', path.join(__dirname, 'src/index.js')],

  output: {
    path: path.join(__dirname, 'public'),
    filename: '[chunkhash].min.js',
    publicPath: '/',
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      favicon: path.join(__dirname, 'src/favicon.png'),
      inject: 'body',
      minify: {
        caseSensitive: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        minifyJS: true,
        keepClosingSlash: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      },
    }),
    new ExtractTextPlugin('[chunkhash].min.css'),
    new OptimizeCssAssetsPlugin({ assetNameRegExp: /\.css$/g, cssProcessor: cssNano, cssProcessorOptions: { discardComments: { removeAll: true } }, canPrint: true }),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, '/src/assets/images/'), to: 'images/' },
      { from: path.join(__dirname, '/src/assets/fonts/'), to: 'fonts/' },
      { from: path.join(__dirname, '/node_modules/font-awesome/fonts/'), to: 'fonts/' },
    ]),
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
        include: [/\.(ttf|woff|woff2|eot|svg)$/],
        loader: require.resolve('file-loader'),
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
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
                plugins: () => [
                  postCssFlexbugFixes,
                  autoprefixer({
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        }),
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
        }),
      },
    ],
  },
};
