const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { getConfig, isDev } = require('./webpack.config.base');

const rendererConfig = getConfig({
  target: 'electron-renderer',
  entry: {
    renderer: path.resolve(process.cwd(), 'src/renderer/index.js'),
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: isDev ? '/' : './',
    filename: '[name].[fullhash].js',
    chunkFilename: '[id].[contenthash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'static/index.html',
      hash: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/renderer/assets', to: 'assets' },
        { from: 'static', to: 'static', globOptions: { ignore: ['**/index.html', '**/icons', '**/icon.png'] } },
      ],
    }),
  ],
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    contentBase: 'dist',
    contentBasePublicPath: '/',
    hot: true,
    inline: true,
    // writeToDisk: true,
  },
});

module.exports = [rendererConfig];
