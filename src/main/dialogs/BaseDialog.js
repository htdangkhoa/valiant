import { nanoid } from 'nanoid';
import { BrowserView } from 'electron';

import { getRendererPath } from 'common';
import { DIALOG_EVENTS } from 'constants/event-names';

class BaseDialog {
  constructor(window, viewName, options) {
    this.opts = Object.assign({}, options);

    this.id = nanoid();

    this.window = window;

    this.browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        additionalArguments: [`dialogId=${this.id}`, `viewName=${viewName}`],
      },
    });
    this.browserView.setAutoResize({ width: true, height: true, vertical: true });
    this.webContents.on('ipc-message', async (e, event, message) => {
      if (event === 'resize-height') {
        const height = await this.webContents.executeJavaScript(`document.body.offsetHeight`);

        const bounds = this.browserView.getBounds();

        this.browserView.setBounds({ ...bounds, height: height + 16 });
      }

      if (event === DIALOG_EVENTS.HIDE_DIALOG && message === this.id) {
        this.hide();
        // setTimeout(() => {
        // }, 200);
      }
    });

    this.browserView.webContents.loadURL(getRendererPath());
  }

  get webContents() {
    return this.browserView.webContents;
  }

  show(rect) {
    this.window.win.removeBrowserView(this.browserView);
    this.window.win.addBrowserView(this.browserView);
    // const { width } = this.window.win.getContentBounds();

    // this.browserView.webContents.loadURL(getRendererPath());

    this.webContents.executeJavaScript(`
      var { ipcRenderer } = require('electron');
      var resizeObserver = new ResizeObserver(([{ contentRect }]) => {
        ipcRenderer.send('resize-height');
      });
      resizeObserver.observe(document.body);
    `);

    this.browserView.setBounds({ x: rect.right - 312, y: rect.bottom - 2, width: 320, height: 0 });

    // if (is.dev) {
    //   this.browserView.webContents.openDevTools({ mode: 'detach' });
    // }

    this.browserView.webContents.focus();
  }

  hide() {
    this.window.win.removeBrowserView(this.browserView);
    // this.browserView.webContents.destroy();
    // this.browserView = null;
  }
}

export default BaseDialog;
