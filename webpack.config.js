const path = require('path');
const { spawn, execSync } = require('child_process');

let electronProcess;

module.exports = {
  mode: 'development',
  target: 'electron-main',
  watch: true,
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
    {
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
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
  },
};
