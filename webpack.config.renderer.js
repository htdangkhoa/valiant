const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDev ? 'development' : 'production',
  target: 'electron-renderer',
  devtool: isDev ? 'source-map' : false,
  entry: {
    renderer: path.resolve(process.cwd(), 'src/renderer/index.js'),
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: isDev ? '/' : './',
    filename: '[name].[fullhash].js',
    chunkFilename: '[id].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'assets',
        },
      },
      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
        options: {
          icon: true,
        },
      },
    ],
  },
  plugins: [
    // new ESLintPlugin(),
    new HtmlWebpackPlugin({
      template: 'static/index.html',
      hash: true,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/renderer/assets', to: 'assets' }],
    }),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx'],
  },
  optimization: {
    minimizer: [
      !isDev &&
        new TerserPlugin({
          extractComments: true,
          terserOptions: {
            ecma: 8,
            output: {
              comments: false,
            },
          },
          parallel: true,
        }),
    ].filter(Boolean),
  },
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    contentBase: 'dist',
    contentBasePublicPath: '/',
  },
};
