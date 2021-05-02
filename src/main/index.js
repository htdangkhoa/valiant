import dotenv from 'dotenv';
import { app, BrowserWindow, ipcMain } from 'electron';
import { format } from 'url';
import path from 'path';

import View from './View';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

function createBrowserView(win) {
  const view = new View(win, { url: 'https://github.com' });
  win.webContents.send('fetch_browser_views');
}

async function createWindow() {
  const win = new BrowserWindow({
    // frame: false,
    thickFrame: true,
    titleBarStyle: 'hidden',
    minWidth: 800,
    minHeight: 600,
    width: 1280,
    height: 720,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      plugins: true,
      javascript: true,
      worldSafeExecuteJavaScript: false,
    },
  });

  if (isDev) {
    // win.maximize();
    win.webContents.openDevTools({ mode: 'detach' });
  }

  const bounds = win.getBounds();
  win.setBounds({ height: bounds.height + 1 });
  win.setBounds(bounds);

  await win.loadURL(
    isDev
      ? 'http://localhost:8080'
      : format({
          protocol: 'file',
          slashes: true,
          pathname: path.resolve(__dirname, '..', '..', 'dist', 'index.html'),
        }),
  );

  createBrowserView(win);

  return win;
}

let win;

app
  .whenReady()
  .then(async () => {
    win = await createWindow();

    app.on('activate', async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        win = await createWindow();
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

ipcMain.on('new_tab', () => {
  createBrowserView(win);
});
