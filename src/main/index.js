import { app, BrowserWindow } from 'electron';
import AppWindow from './AppWindow';

let win;

app
  .whenReady()
  .then(() => {
    win = new AppWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        win = new AppWindow();
      }
    });
  })
  .catch((e) => {
    console.error(e);

    app.exit();
  });

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    app.quit();
  }
});
