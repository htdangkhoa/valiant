import { v4 as uuid } from 'uuid';
import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import { format } from 'url';
import path from 'path';

import { WINDOW_EVENTS } from 'root/constants/event-names';

import ViewManager from './ViewManager';
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
      },
    });

    this.viewManager = new ViewManager(this);

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

      const menu = Menu.buildFromTemplate([
        { label: 'New Tab to the right' },
        { label: 'Move Tab to New Window\t\t', click: () => AppInstance.getInstance().createWindow() },
        { type: 'separator' },
        { label: 'Reload' },
        { label: 'Duplicate' },
        { label: 'Pin Tab' },
        { label: 'Mute Tab' },
        { type: 'separator' },
        { label: 'Close' },
        { label: 'Close Other Tabs' },
      ]);

      ipcMain.on('contextmenu', () => {
        menu.popup(this.webContents);
      });

      ipcMain.on(this.id, (e, windowEvent, message) => {
        switch (windowEvent) {
          case WINDOW_EVENTS.NEW_TAB: {
            return this.viewManager.create({ url: 'https://google.com' });
          }
          case WINDOW_EVENTS.SWITCH_TAB: {
            const { id } = message;

            const { browserView } = this.viewManager.getView(id);

            this.win.setBrowserView(browserView);

            this.viewManager.setSelected(id);

            break;
          }
          case WINDOW_EVENTS.CLOSE_TAB: {
            const { id } = message;

            const { browserView } = this.viewManager.getView(id);

            this.win.removeBrowserView(browserView);

            browserView.webContents.destroy();

            this.viewManager.views.delete(id);

            break;
          }
          case WINDOW_EVENTS.CLOSE: {
            AppInstance.getInstance().windows.delete(this.id);
            this.win.close();

            break;
          }
          default:
            break;
        }
      });

      this.emit(WINDOW_EVENTS.CREATED, this.id);

      if (!this.opts.view) {
        this.viewManager.create({ url: 'https://github.com' });
      }
    })();
  }

  get webContents() {
    return this.win.webContents;
  }

  updateTitle() {
    const { selected, getView } = this.viewManager;

    const view = getView.apply(this.viewManager, [selected]);

    if (!view) return this.win.setTitle(app.name);

    const { browserView } = view;

    this.win.setTitle(`${browserView.title} | ${app.name}`);
  }

  emit(event, ...args) {
    this.webContents.send(WINDOW_EVENTS.RENDERER, event, ...args);
  }
}

export default Window;
