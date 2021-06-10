import { BrowserView, ipcMain } from 'electron';
import { defer, getPreload, getRendererPath } from 'common';
import { DIALOG_EVENTS } from 'constants/event-names';
import AppInstance from 'main/core/AppInstance';

class BaseDialog {
  constructor(viewName, options = { autoHide: true, targetElement: undefined }) {
    this.opts = Object.assign({}, options);
    if (typeof this.opts.autoHide !== 'boolean') {
      this.opts.autoHide = true;
    }

    this.channels = [];

    this.isOpening = false;

    this.browserView = new BrowserView({
      webPreferences: {
        preload: this.opts.autoHide && getPreload('dialog'),
        nodeIntegration: true,
        contextIsolation: false,
        additionalArguments: [`viewName=${viewName}`],
      },
    });

    this.webContents.on('ipc-message', async (e, event, message) => {
      if (event === 'resize-height') {
        this.fixBounds();
      }

      if (event === DIALOG_EVENTS.HIDE_DIALOG && message === this.id) {
        this.hide();
      }
    });

    this.webContents.loadURL(getRendererPath('index.html'));
  }

  get window() {
    return AppInstance.getInstance().focusedWindow;
  }

  get webContents() {
    return this.browserView.webContents;
  }

  get id() {
    return this.webContents.id;
  }

  async fixBounds() {
    let rect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0, x: 0, y: 0 };

    if (this.opts.targetElement) {
      rect = await this.window.webContents.executeJavaScript(
        `
          (() => {
            const propValueSet = (prop) => (value) => (obj) => ({...obj, [prop]: value});
            const toObj = keys => obj => keys.reduce((o, k) => propValueSet(k)(obj[k])(o), {});
            const getBoundingClientRect = el => toObj(['top', 'right', 'bottom', 'left', 'width', 'height', 'x', 'y'])(el.getBoundingClientRect());
  
            return getBoundingClientRect(document.getElementById('${this.opts.targetElement}'));
          })();
        `,
      );
    }

    const height = await this.webContents.executeJavaScript(`document.body.offsetHeight`);

    this.browserView.setBounds(this.onDraw(height, rect));
  }

  // eslint-disable-next-line no-unused-vars
  onDraw(contentHeight, rect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0, x: 0, y: 0 }) {
    throw new Error(`'onDraw' must be overridden.`);
  }

  show(options = { showDevTools: false, focus: true }) {
    const opts = Object.assign({}, options);

    if (this.isOpening) return;

    this.isOpening = true;

    defer(() => {
      this.window.win.addBrowserView(this.browserView);

      this.webContents.executeJavaScript(`
      var { ipcRenderer } = require('electron');
      var resizeObserver = new ResizeObserver(([{ contentRect }]) => {
        ipcRenderer.send('resize-height');
      });
      resizeObserver.observe(document.body);
    `);

      if (opts.showDevTools) {
        this.webContents.openDevTools({ mode: 'detach' });
      }

      if (opts.focus) {
        this.webContents.focus();
      }
    });

    return this.id;
  }

  hide() {
    this.window.win.removeBrowserView(this.browserView);
    this.isOpening = false;

    this.channels.forEach((event) => {
      ipcMain.removeAllListeners(event);
    });
  }

  on(event, callback) {
    const channel = `${event}-${this.id}`;
    ipcMain.on(channel, callback);
    this.channels.push(channel);
  }
}

export default BaseDialog;
