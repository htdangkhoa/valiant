// import { app, BrowserWindow, Menu, ipcMain } from 'electron';
// import { initialize as initializeRemoteModule } from '@electron/remote/main';
// import AppWindow from './AppWindow';

// initializeRemoteModule();

// const menu = Menu.buildFromTemplate([
//   { label: 'New Tab to the right' },
//   {
//     label: 'Move Tab to New Window',
//     click: () => {
//       createWindow();
//     },
//   },
//   { type: 'separator' },
//   { label: 'Reload' },
//   { label: 'Duplicate' },
//   { label: 'Pin Tab' },
//   { label: 'Mute Tab' },
//   { type: 'separator' },
//   { label: 'Close' },
//   { label: 'Close Other Tabs' },
// ]);

// const windows = [];

// let selectedWindow;

// function createWindow() {
//   const win = new AppWindow();
//   windows.push(win);
//   selectedWindow = win;

//   return win;
// }

// app
//   .whenReady()
//   .then(() => {
//     createWindow();

//     app.on('activate', () => {
//       if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow();
//       }
//     });

//     ipcMain.on('contextmenu', () => {
//       menu.popup();
//     });
//   })
//   .catch((e) => {
//     console.error(e);

//     app.exit();
//   });

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
