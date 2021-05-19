import { app, BrowserWindow } from 'electron';
import { initialize as initializeRemoteModule } from '@electron/remote/main';
import unhandled from 'electron-unhandled';
import AppInstance from './AppInstance';

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
