require('dotenv').config();
const path = require('path');
const { app, BrowserWindow } = require('electron');
const url = require('url');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    win.maximize();
    win.webContents.openDevTools();
  }

  win.loadURL(
    isDev
      ? 'http://localhost:8080'
      : url.format({
          protocol: 'file',
          slashes: true,
          pathname: path.resolve(__dirname, '..', '..', 'dist', 'index.html'),
        }),
  );
}

async function main() {
  if (isDev) {
    // eslint-disable-next-line global-require
    require('electron-reload')(__dirname, {
      electron: path.resolve(process.cwd(), 'node_modules/.bin/electron'),
    });
  }

  app
    .whenReady()
    .then(() => {
      createWindow();

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        }
      });
    })
    .catch((error) => {
      console.error(error);

      app.exit();
    });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

main();
