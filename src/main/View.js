import { ipcMain, BrowserView } from 'electron';
import { TAB_EVENTS, WINDOW_EVENTS } from 'constants/event-names';

import { VIEW_SOURCE } from 'constants/protocol';
import { getPreload } from 'common';

import AppInstance from './AppInstance';
import contextMenu from './menus/view';
import { History, insert, update } from './database';

class View {
  constructor(options = { url: 'about:blank', nextTo: null, active: false }) {
    this.opts = Object.assign({}, options);

    this.browserView = new BrowserView({
      webPreferences: {
        preload: getPreload('view'),
        nodeIntegration: false,
        contextIsolation: true,
        plugins: true,
        nativeWindowOpen: true,
        webSecurity: true,
        javascript: true,
        worldSafeExecuteJavaScript: false,
        sandbox: true,
        enableRemoteModule: false,
      },
    });
    this.browserView.setBackgroundColor('#ffffff');
    this.browserView.setAutoResize({ width: true });
    this.webContents.on('page-title-updated', (e, title) => {
      this.title = title;

      this.updateStorage();

      this.emit(TAB_EVENTS.UPDATE_TITLE, this.title || 'Untitled');
    });
    this.webContents.on('page-favicon-updated', (e, favicons) => {
      const [favicon] = favicons;
      this.favicon = favicon;

      this.updateStorage();

      this.emit(TAB_EVENTS.UPDATE_FAVICON, favicon);
    });
    this.webContents.on('did-start-loading', () => {
      this.loading = true;

      this.updateNavigationState();

      this.emit(TAB_EVENTS.UPDATE_LOADING, true);
    });
    this.webContents.on('did-stop-loading', () => {
      this.loading = false;

      this.updateNavigationState();

      this.emit(TAB_EVENTS.UPDATE_LOADING, false);
    });
    this.webContents.on('did-start-navigation', () => {
      this.updateNavigationState();
    });
    this.webContents.on('did-navigate', async (e, url) => {
      this.addHistory(url);

      this.lastUrl = url;

      this.emit(
        TAB_EVENTS.UPDATE_TITLE,
        this.opts.url?.startsWith?.(VIEW_SOURCE) ? this.opts.url : this.title || 'Untitled',
      );
      this.emit(
        TAB_EVENTS.UPDATE_URL,
        this.opts.url?.startsWith?.(VIEW_SOURCE) ? this.opts.url : this.errorUrl || this.lastUrl,
      );
    });
    this.webContents.on('did-navigate-in-page', (e, url, isMainFrame) => {
      if (isMainFrame) {
        this.addHistory(url, true);

        this.lastUrl = url;

        this.emit(TAB_EVENTS.UPDATE_URL, url);
      }
    });
    this.webContents.on('did-fail-load', async (e, errorCode, errorDescription, validateUrl, isMainFrame) => {
      if (isMainFrame) {
        this.errorUrl = validateUrl;

        this.title = validateUrl;

        this.webContents.loadURL(`valiant://network-error/${errorCode}`);
      }
    });
    this.webContents.on('new-window', (e, url, frameName, disposition) => {
      if (disposition === 'new-window') {
        if (frameName === '_self') {
          e.preventDefault();
          this.webContents.loadURL(url);
        } else if (frameName === '_blank') {
          e.preventDefault();
          const { viewManager } = this.window;

          const index = viewManager.ids.indexOf(viewManager.selected);

          viewManager.create({ url, nextTo: index + 1, active: true });
        }
      } else if (disposition === 'foreground-tab') {
        e.preventDefault();
        const { viewManager } = this.window;

        const index = viewManager.ids.indexOf(viewManager.selected);

        viewManager.create({ url, nextTo: index + 1, active: true });
      } else if (disposition === 'background-tab') {
        e.preventDefault();
        const { viewManager } = this.window;

        const index = viewManager.ids.indexOf(viewManager.selected);

        viewManager.create({ url, nextTo: index + 1 });
      }
    });
    this.webContents.on('context-menu', (e, params) => {
      e.preventDefault();

      const menu = contextMenu(params, this.webContents);
      menu.popup();
    });

    ipcMain.handle(`get-error-url-${this.id}`, () => this.errorUrl);

    this.render(this.opts);

    this.webContents.loadURL(this.opts.url);
  }

  get id() {
    return this.webContents.id;
  }

  get webContents() {
    return this.browserView.webContents;
  }

  get window() {
    const { focusedWindow } = AppInstance.getInstance();
    return focusedWindow;
  }

  render(options = { nextTo: null, active: false }) {
    const opts = Object.assign({}, options);

    if (opts.active) {
      this.window.win.addBrowserView(this.browserView);
    }

    this.window.fixBounds();

    if (typeof opts.nextTo === 'number') {
      this.window.emit(WINDOW_EVENTS.TAB_CREATED, {
        id: this.id,
        nextTo: opts.nextTo,
        active: opts.active,
      });
    }

    this.emit(TAB_EVENTS.UPDATE_TITLE, this.title);
    this.emit(TAB_EVENTS.UPDATE_FAVICON, this.favicon);
    this.emit(TAB_EVENTS.UPDATE_URL, this.lastUrl);
  }

  destroy() {
    this.window.win.removeBrowserView(this.browserView);
    this.webContents.destroy();
    this.browserView = null;
  }

  updateNavigationState() {
    if (this.webContents.isDestroyed()) return;

    this.emit(TAB_EVENTS.UPDATE_NAVIGATION_STATE, {
      canGoBack: this.webContents.canGoBack(),
      canGoForward: this.webContents.canGoForward(),
    });
  }

  emit(event, ...args) {
    this.window.webContents.send(String(this.id), event, ...args);
  }

  async addHistory(url, inPage) {
    if (this.lastUrl !== url) {
      const history = await insert(History, {
        title: this.title,
        url,
        favicon: this.favicon,
        date: new Date().getTime(),
      });

      this.lastHistoryId = history._id;
    } else if (!inPage) {
      this.lastHistoryId = '';
    }
  }

  async updateStorage() {
    if (this.lastHistoryId) {
      const { title, favicon } = this;

      await update(
        History,
        {
          _id: this.lastHistoryId,
        },
        { $set: { title, favicon } },
      );
    }
  }
}

export default View;
