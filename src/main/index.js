import { app, BrowserWindow } from 'electron';
import { initialize as initializeRemoteModule } from '@electron/remote/main';
import AppInstance from './AppInstance';

initializeRemoteModule();

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
  if (process.platform === 'darwin') {
    app.quit();
  }
});
