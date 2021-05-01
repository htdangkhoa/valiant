import dotenv from 'dotenv';
import { app, BrowserWindow } from 'electron';
import { format } from 'url';
import path from 'path';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    win.maximize();
    win.webContents.openDevTools();
  }

  win.loadURL(
    isDev
      ? 'http://localhost:8080'
      : format({
          protocol: 'file',
          slashes: true,
          pathname: path.resolve(__dirname, '..', '..', 'dist', 'index.html'),
        }),
  );

  return win;
}

function main() {
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
    .catch((e) => {
      console.error(e);

      app.exit();
    });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

main();
