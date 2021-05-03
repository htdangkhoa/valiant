const path = require('path');
const { spawn, execSync } = require('child_process');

const isDev = process.env.NODE_ENV === 'development';

let electronProcess;

module.exports = {
  mode: isDev ? 'development' : 'production',
  target: 'electron-main',
  devtool: isDev ? 'source-map' : false,
  watch: isDev,
  entry: {
    main: path.resolve(process.cwd(), 'src/main/index.js'),
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    isDev && {
      apply(compiler) {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
          if (electronProcess) {
            try {
              if (process.platform === 'win32') {
                execSync(`taskkill /pid ${electronProcess.pid} /f /t`);
              } else {
                electronProcess.kill();
              }

              electronProcess = null;
            } catch (e) {
              console.log(e);
            }
          }

          electronProcess = spawn('npm', ['start']);
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
  },
};
