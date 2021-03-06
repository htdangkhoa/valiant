import path from 'path';
import { app, protocol, ipcMain, BrowserWindow } from 'electron';
import { initialize as initializeRemoteModule } from '@electron/remote/main';
import unhandled from 'electron-unhandled';

import { VALIANT, VIEW_SOURCE } from 'constants/protocol';
import AppInstance from './core/AppInstance';

const isDev = process.env.NODE_ENV === 'development';

initializeRemoteModule();
unhandled({ showDialog: !isDev });

if (isDev) {
  // eslint-disable-next-line global-require
  require('source-map-support').install();
}

app.commandLine.appendArgument('force_high_performance_gpu');

app
  .whenReady()
  .then(() => {
    protocol.registerFileProtocol(VALIANT, (request, callback) => {
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

ipcMain.on('get-current-view-id', (e) => {
  const { focusedWindow: window } = AppInstance.getInstance();

  if (!window) return;

  const { viewManager } = window;

  e.returnValue = viewManager.selected;
});

ipcMain.on('get-current-window-id', (e) => {
  const { focusedWindow: window } = AppInstance.getInstance();

  if (!window) return;

  e.returnValue = window.id;
});

ipcMain.handle('webcontents-call', async (e, { webContentsId, method, args }) => {
  const { focusedWindow: window } = AppInstance.getInstance();

  const view = window.viewManager.views.get(webContentsId);

  if (!view) return;

  if (method === 'reload') {
    if (view.errorUrl || view.lastUrl?.startsWith?.(VIEW_SOURCE)) {
      view.webContents.loadURL(view.errorUrl || view.lastUrl);
      return;
    }

    view.errorUrl = undefined;
  }

  const params = [].concat(args);
  const result = view.webContents[method](...params);

  if (result) {
    if (result instanceof Promise) {
      const value = await result;
      return value;
    }

    return result;
  }
});
