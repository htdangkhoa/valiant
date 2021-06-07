const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

const isDev = process.env.NODE_ENV === 'development';

const config = {
  mode: isDev ? 'development' : 'production',

  devtool: isDev ? 'source-map' : false,

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
  // plugins: [new ESLintPlugin()],
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
};

const getConfig = (...cnf) => merge(config, ...cnf);

module.exports = {
  getConfig,
  get isDev() {
    return isDev;
  },
  get outputBundleConfig() {
    return {
      path: path.join(__dirname, 'dist'),
      filename: '[name].bundle.js',
    };
  },
};
