import { BrowserView } from 'electron';
import { NAVIGATION_EVENT, TAB_EVENTS, WINDOW_EVENTS } from 'root/constants/event-names';
import { nanoid } from 'nanoid';
import AppInstance from './AppInstance';
import contextMenu from './menus/view';

class View {
  constructor(options = { url: 'about:blank', nextTo: null, active: false }) {
    this.opts = Object.assign({}, options);

    this.id = nanoid();
    this.browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        plugins: true,
        nativeWindowOpen: true,
        webSecurity: true,
        javascript: true,
        worldSafeExecuteJavaScript: true,
        sandbox: true,
      },
    });
    this.browserView.setBackgroundColor('#ffffff');
    this.browserView.setAutoResize({ width: true });
    this.webContents.on('page-title-updated', (e, title) => {
      this.title = title;

      this.emit(TAB_EVENTS.UPDATE_TITLE, title);
    });
    this.webContents.on('page-favicon-updated', (e, favicons) => {
      const [favicon] = favicons;
      this.favicon = favicon;

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
    this.webContents.on('did-navigate', (e, url) => {
      this.lastUrl = url;

      this.emit(TAB_EVENTS.UPDATE_URL, url);
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

    this.render(this.opts);

    this.webContents.loadURL(this.opts.url);
  }

  get webContents() {
    return this.browserView.webContents;
  }

  get window() {
    const { focusedWindow } = AppInstance.getInstance();
    return focusedWindow;
  }

  async fixBounds() {
    const { win, webContents } = this.window;

    const { width, height } = win.getContentBounds();

    const toolbarContentHeight = await webContents.executeJavaScript(`document.getElementById('toolbar').offsetHeight`);

    const newBounds = {
      x: 0,
      y: toolbarContentHeight,
      width,
      height: height - toolbarContentHeight,
    };

    if (newBounds !== this.browserView.getBounds()) {
      this.browserView.setBounds(newBounds);
    }
  }

  setBoundsListener() {
    const { focusedWindow: window } = AppInstance.getInstance();

    window.webContents.executeJavaScript(`
      var { ipcRenderer } = require('electron');
      var resizeObserver = new ResizeObserver(([{ contentRect }]) => {
        ipcRenderer.send('resize-height');
      });
      var toolbar = document.getElementById('toolbar');
      resizeObserver.observe(toolbar);
    `);

    window.webContents.on('ipc-message', (e, message) => {
      if (message === 'resize-height') {
        this.fixBounds();
      }
    });
  }

  render(options = { nextTo: null, active: false }) {
    const opts = Object.assign({}, options);

    if (opts.active) {
      this.window.win.addBrowserView(this.browserView);
    }

    this.fixBounds();
    this.setBoundsListener();

    if (typeof opts.nextTo === 'number') {
      this.window.emit(WINDOW_EVENTS.TAB_CREATED, {
        id: this.id,
        nextTo: opts.nextTo,
        active: opts.active,
      });
    }

    this.emit(TAB_EVENTS.UPDATE_TITLE, this.title);
    this.emit(TAB_EVENTS.UPDATE_FAVICON, this.favicon);
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
    this.window.webContents.send(this.id, event, ...args);
  }
}

export default View;
