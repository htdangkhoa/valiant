import { v4 as uuid } from 'uuid';
import { BrowserWindow, ipcMain } from 'electron';
import { format } from 'url';
import path from 'path';

import { WINDOW_EVENTS } from 'root/constants/event-names';

import AppInstance from './AppInstance';

const isDev = process.env.NODE_ENV === 'development';

class Window {
  constructor(options = { incognito: false, view: null }) {
    this.id = uuid();

    this.opts = Object.assign({}, options);

    // create the new browser window from electron
    this.win = new BrowserWindow({
      minWidth: 800,
      minHeight: 600,
      width: 1280,
      height: 720,
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
        plugins: true,
        javascript: true,
        worldSafeExecuteJavaScript: true,
        additionalArguments: [`windowId=${this.id}`],
      },
    });

    if (isDev) {
      this.webContents.openDevTools({ mode: 'detach' });
    }

    (async () => {
      if (isDev) {
        this.win.webContents.openDevTools({ mode: 'detach' });
        await this.win.loadURL('http://localhost:8080');
      } else {
        await this.win.loadURL(
          format({
            protocol: 'file',
            slashes: true,
            pathname: path.resolve(__dirname, 'index.html'),
          }),
        );
      }

      if (!this.opts.view) {
        AppInstance.getInstance().viewManager.create({ url: 'https://github.com' });
      } else {
        this.opts.view.update({ create: true });
      }

      ipcMain.on(this.id, (e, event, message) => {
        if (event === WINDOW_EVENTS.NEW_TAB) {
          return AppInstance.getInstance().viewManager.create({ url: 'http://google.com' });
        }

        if (event === WINDOW_EVENTS.SWITCH_TAB) {
          const { id } = message;

          return AppInstance.getInstance().viewManager.selectView(id);
        }

        if (event === WINDOW_EVENTS.CLOSE_TAB) {
          const { id } = message;

          return AppInstance.getInstance().viewManager.destroyView(id);
        }
      });
    })();
  }

  get webContents() {
    return this.win.webContents;
  }

  updateTitle() {
    // const { selected, getView } = this.viewManager;
    // const view = getView.apply(this.viewManager, [selected]);
    // if (!view) return this.win.setTitle(app.name);
    // const { browserView } = view;
    // this.win.setTitle(`${browserView.title} | ${app.name}`);
  }

  emit(event, ...args) {
    this.webContents.send(this.id, event, ...args);
  }
}

export default Window;
