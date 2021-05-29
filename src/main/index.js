import path from 'path';
import { app, protocol, ipcMain, BrowserWindow, webContents } from 'electron';
import { initialize as initializeRemoteModule } from '@electron/remote/main';
import unhandled from 'electron-unhandled';
import AppInstance from './core/AppInstance';
import logger from 'common/logger';

const isDev = process.env.NODE_ENV === 'development';

initializeRemoteModule();
unhandled({ showDialog: !isDev });

if (isDev) {
  // eslint-disable-next-line global-require
  require('source-map-support').install();
}

app
  .whenReady()
  .then(() => {
    protocol.registerFileProtocol('valiant', (request, callback) => {
      const url = new URL(request.url);

      if (url.hostname === 'network-error') {
        return callback({ path: path.join(__dirname, '../static', 'network-error.html') });
      }
    });

    const appInstance = AppInstance.initialize();

    appInstance.createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        appInstance.createWindow();
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

ipcMain.on('get-webcontents-id', (e) => {
  e.returnValue = e.sender.id;
});

ipcMain.handle('web-contents-call', async (e, { webContentsId, method, args }) => {
  const { focusedWindow: window } = AppInstance.getInstance();

  const view = window.viewManager.views.get(webContentsId);

  if (!view) return;

  logger.log('web-contents-call', view.errorUrl);

  if (method === 'reload' && view.errorUrl) {
    view.webContents.loadURL(view.errorUrl);
    view.errorUrl = undefined;

    return;
  }

  const result = view.webContents[method](...args);

  if (result) {
    if (result instanceof Promise) {
      const value = await result;
      return value;
    }

    return result;
  }
});
