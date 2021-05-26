const path = require('path');
const { spawn, execSync } = require('child_process');
const { getConfig, isDev, outputBundleConfig } = require('./webpack.config.base');

let electronProcess;

const mainConfig = getConfig({
  target: 'electron-main',
  watch: isDev,
  entry: {
    main: path.resolve(process.cwd(), 'src/main/index.js'),
  },
  output: outputBundleConfig,
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
              console.error(e);
            }
          }

          electronProcess = spawn('npm', ['start'], {
            shell: true,
            env: process.env,
            stdio: 'inherit',
          });
        });
      },
    },
  ].filter(Boolean),
});

const preloadConfig = getConfig({
  target: 'electron-renderer',
  watch: isDev,
  entry: {
    'view-preload': './src/preloads/view.js',
    'dialog-preload': './src/preloads/dialog.js',
  },
  output: outputBundleConfig,
});

module.exports = [mainConfig, preloadConfig];
