import { WINDOW_EVENTS } from 'constants/event-names';
import { BrowserWindow, ipcMain } from 'electron';
import { format } from 'url';
import { nanoid } from 'nanoid';
import path from 'path';

import AppInstance from './AppInstance';
import request from './request';
import ViewManager from './ViewManager';

const isDev = process.env.NODE_ENV === 'development';

class Window {
  constructor(options = { incognito: false, view: null }) {
    this.instance = AppInstance.getInstance();

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

    (async () => {
      if (isDev) {
        await this.win.loadURL('http://localhost:8080');

        this.win.webContents.openDevTools({ mode: 'detach' });

        this.win.webContents.on('dom-ready', () => {
          this.instance.closeWindow(this.id);

          this.instance.createWindow();
        });
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
        // this.opts.view.render({ appendToLast: true });
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

        if (event === WINDOW_EVENTS.SWAP_TAB) {
          const { from, to } = message;
          this.viewManager.swapView(from, to);
        }

        if (event === WINDOW_EVENTS.CLOSE) {
          this.instance.closeWindow(this.id);
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
