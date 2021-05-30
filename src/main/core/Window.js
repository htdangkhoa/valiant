import { WINDOW_EVENTS } from 'constants/event-names';
import { app, BrowserWindow, ipcMain } from 'electron';

import { VIEW_TOOLBAR } from 'constants/view-names';
import { defer, getRendererPath } from 'common';

import AppInstance from './AppInstance';
// import request from './request';
import ViewManager from './ViewManager';

const isDev = process.env.NODE_ENV === 'development';

class Window {
  constructor(options = { incognito: false, view: null }) {
    this.instance = AppInstance.getInstance();

    this.opts = Object.assign({}, options);

    this.viewManager = new ViewManager(this);

    // create the new browser window from electron
    this.win = new BrowserWindow({
      minWidth: 800,
      minHeight: 600,
      width: 1280,
      height: 720,
      titleBarStyle: 'hiddenInset',
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        plugins: true,
        javascript: true,
        worldSafeExecuteJavaScript: true,
        additionalArguments: [`viewName=${VIEW_TOOLBAR}`],
      },
    });

    this.win.on('resize', () => {
      defer(() => {
        this.instance.dialogs.settings.fixBounds();
        this.instance.dialogs.settings.webContents.focus();
      });
    });

    (async () => {
      await this.win.loadURL(getRendererPath('index.html'));

      if (isDev) {
        this.webContents.openDevTools({ mode: 'detach' });

        // hot reload when the renderer is changed.
        this.webContents.on('dom-ready', () => {
          const { windows } = this.instance;

          for (let i = 0; i < windows.size; i += 1) {
            const key = Array.from(windows.keys())[i];

            if (this.webContents.isDevToolsOpened()) {
              this.webContents.closeDevTools();
            }
            this.instance.closeWindow(key);
          }

          this.instance.createWindow();
        });
      }

      if (!this.opts.view) {
        this.viewManager.create({ url: 'https://github.com', active: true });
      } else {
        const { view } = this.opts;
        view.render({ nextTo: this.viewManager.views.size, active: true });
        this.viewManager.views.set(view.id, view);
        this.viewManager.selectView(view.id);
      }

      // setTimeout(() => {
      //   this.instance.dialogs.suggestion.show(true);
      // }, 1500);

      this.setBoundsListener();

      ipcMain.on(this.id, async (e, event, message) => {
        if (event === WINDOW_EVENTS.NEW_TAB) {
          const { nextTo, active } = message || {};

          await this.viewManager.create({ url: 'http://google.com', nextTo, active });

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

        if (event === WINDOW_EVENTS.MOVE_TAB_TO_NEW_WINDOW) {
          const view = this.viewManager.views.get(message);

          if (!view) return;

          this.viewManager.views.delete(view.id);

          this.instance.createWindow({ view });
        }

        if (event === WINDOW_EVENTS.OPEN_QUICK_MENU) {
          this.instance.dialogs.settings.show(message);
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

  get id() {
    return this.win.id.toString();
  }

  get webContents() {
    return this.win.webContents;
  }

  updateTitle() {
    const { selectedView: view } = this.viewManager;
    if (!view) return this.win.setTitle(app.name);
    // const { browserView } = view;

    let title = `${app.name}`;

    if (view.title) {
      title = `${view.title} | ${title}`;
    }

    this.win.setTitle(title);
  }

  emit(event, ...args) {
    this.webContents.send(this.id, event, ...args);
  }

  async fixBounds() {
    const { win, webContents } = this;

    const { width, height } = win.getContentBounds();

    const toolbarContentHeight = await webContents.executeJavaScript(`document.getElementById('toolbar').offsetHeight`);

    const newBounds = {
      x: 0,
      y: toolbarContentHeight,
      width,
      height: height - toolbarContentHeight,
    };

    const view = this.viewManager.views.get(this.viewManager.selected);

    if (!view) return;

    if (newBounds !== view.browserView.getBounds()) {
      view.browserView.setBounds(newBounds);
    }
  }

  async setBoundsListener() {
    this.webContents.executeJavaScript(`
      const { ipcRenderer } = require('electron');
      const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
        ipcRenderer.send('resize-height');
      });
      const toolbar = document.getElementById('toolbar');
      resizeObserver.observe(toolbar);
    `);

    this.webContents.on('ipc-message', (e, message, ...args) => {
      if (message === 'resize-height') {
        this.fixBounds();
      }

      if (message === this.viewManager.selected) {
        const view = this.viewManager.views.get(this.viewManager.selected);
        if (!view) return;

        const [method, ...params] = args;

        if (typeof view.webContents[method] === 'function') {
          view.webContents[method](...params);
        }
      }
    });
  }
}

export default Window;
