import { app, BrowserWindow } from 'electron';
import { format } from 'url';
import path from 'path';
import ViewManager from './ViewManager';

const isDev = process.env.NODE_ENV === 'development';

class AppWindow {
  constructor() {
    this.win = new BrowserWindow({
      minWidth: 800,
      minHeight: 600,
      width: 1270,
      height: 720,
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
        plugins: true,
        javascript: true,
      },
    });

    this.viewManager = new ViewManager(this);

    if (isDev) {
      this.win.webContents.openDevTools({ mode: 'detach' });
    }

    // fix draggable
    const bounds = this.win.getBounds();
    this.win.setBounds({ height: bounds.height + 1 });
    this.win.setBounds(bounds);

    if (isDev) {
      this.win.webContents.openDevTools({ mode: 'detach' });
      this.win.loadURL('http://localhost:8080');
    } else {
      this.win.loadURL(
        format({
          protocol: 'file',
          slashes: true,
          pathname: path.resolve(__dirname, '..', '..', 'dist', 'index.html'),
        }),
      );
    }

    this.viewManager.create({ url: 'https://github.com' });
  }

  get webContents() {
    return this.win.webContents;
  }
}

export default AppWindow;
