import { nanoid } from 'nanoid';
import { BrowserView } from 'electron';

import { getPreload, getRendererPath, is } from 'common';
import { DIALOG_EVENTS } from 'constants/event-names';

class BaseDialog {
  constructor(window, viewName, targetElement, options) {
    this.opts = Object.assign({}, options);

    this.id = nanoid();

    this.window = window;

    this.targetElement = targetElement;

    this.browserView = new BrowserView({
      webPreferences: {
        preload: getPreload('dialog'),
        nodeIntegration: true,
        contextIsolation: false,
        additionalArguments: [`dialogId=${this.id}`, `viewName=${viewName}`],
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

  get webContents() {
    return this.browserView.webContents;
  }

  async fixBounds() {
    const rect = await this.window.webContents.executeJavaScript(
      `
        (() => {
          const propValueSet = (prop) => (value) => (obj) => ({...obj, [prop]: value});
          const toObj = keys => obj => keys.reduce((o, k) => propValueSet(k)(obj[k])(o), {});
          const getBoundingClientRect = el => toObj(['top', 'right', 'bottom', 'left', 'width', 'height', 'x', 'y'])(el.getBoundingClientRect());

          return getBoundingClientRect(document.getElementById('${this.targetElement}'));
        })();
      `,
    );

    const height = await this.webContents.executeJavaScript(`document.body.offsetHeight`);

    this.browserView.setBounds(this.onDraw(height, rect));
  }

  onDraw(_contentHeight, _rect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0, x: 0, y: 0 }) {
    throw new Error(`'onDraw' must be overridden.`);
  }

  show(rect = { right: 0, bottom: 0 }) {
    this.clientRect = Object.assign({}, rect);

    this.window.win.removeBrowserView(this.browserView);

    setTimeout(() => {
      this.window.win.addBrowserView(this.browserView);

      this.webContents.executeJavaScript(`
      var { ipcRenderer } = require('electron');
      var resizeObserver = new ResizeObserver(([{ contentRect }]) => {
        ipcRenderer.send('resize-height');
      });
      resizeObserver.observe(document.body);
    `);

      if (is.dev) {
        this.browserView.webContents.openDevTools({ mode: 'detach' });
      }

      this.browserView.webContents.focus();
    }, 50);
  }

  hide() {
    this.window.win.removeBrowserView(this.browserView);
    // this.browserView.webContents.destroy();
    // this.browserView = null;
  }
}

export default BaseDialog;
