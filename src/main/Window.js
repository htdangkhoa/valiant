import { nanoid } from 'nanoid';
import { dialog, BrowserWindow, ipcMain } from 'electron';
import { format } from 'url';
import path from 'path';

import { ADDRESS_BAR_EVENTS, WINDOW_EVENTS } from 'root/constants/event-names';

import AppInstance from './AppInstance';
import ViewManager from './ViewManager';
import request from './request';

const isDev = process.env.NODE_ENV === 'development';

class Window {
  constructor(options = { incognito: false, view: null }) {
    this.id = nanoid();

    this.opts = Object.assign({}, options);

    this.viewManager = new ViewManager(this);

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
        this.viewManager.create({ url: 'https://github.com', active: true });
      } else {
        // this.opts.view.update({ appendToLast: true });
      }

      ipcMain.on(this.id, async (e, event, message) => {
        if (event === WINDOW_EVENTS.NEW_TAB) {
          const { nextTo, active } = message || {};

          const hasNextTo = typeof nextTo === 'number';

          await this.viewManager.create({ url: 'http://google.com', nextTo: hasNextTo && nextTo, active });

          return;
        }

        if (event === WINDOW_EVENTS.SWITCH_TAB) {
          const { id } = message;

          return this.viewManager.selectView(id);
        }

        if (event === WINDOW_EVENTS.CLOSE_TAB) {
          const { id } = message;

          return this.viewManager.destroyView(id);
        }
      });

      // const suggestionEvent = `${ADDRESS_BAR_EVENTS.REQUEST_SUGGEST}-${this.id}`;
      // ipcMain.on(suggestionEvent, async (e, message) => {
      //   try {
      //     const res = await request(`http://google.com/complete/search?client=chrome&q=${encodeURIComponent(message)}`);
      //     this.webContents.send(suggestionEvent, { input: message, ...res });
      //   } catch (error) {
      //     this.webContents.send(suggestionEvent, { input: message, error });
      //   }
      // });
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
