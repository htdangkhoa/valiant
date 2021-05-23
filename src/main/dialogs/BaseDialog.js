import { nanoid } from 'nanoid';
import { BrowserView } from 'electron';

import { getRendererPath } from 'common';
import logger from 'common/logger';
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
        // enableRemoteModule: true,
        // plugins: true,
        // javascript: true,
        // worldSafeExecuteJavaScript: true,
        // preload: path.resolve(process.cwd(), 'src/main/preloads/dialog.js'),
      },
    });
    this.browserView.setBackgroundColor('#ffffff');
    this.browserView.setAutoResize({ width: true, height: true, vertical: true });
    this.browserView.webContents.on('ipc-message', (e, event, message) => {
      if (event === DIALOG_EVENTS.HIDE_DIALOG && message === this.id) {
        logger.log('BaseDialog', event, message);

        setTimeout(() => {
          this.hide();
        }, 200);
      }
    });
  }

  show(rect) {
    logger.log('.....', rect);

    this.window.win.addBrowserView(this.browserView);
    // const { width } = this.window.win.getContentBounds();
    this.browserView.setBounds({ x: rect.right - 320, y: rect.bottom, width: 320, height: 600 });

    this.browserView.webContents.loadURL(getRendererPath());
    // this.browserView.webContents.openDevTools({ mode: 'detach' });

    this.browserView.webContents.focus();
  }

  hide() {
    this.window.win.removeBrowserView(this.browserView);
    this.browserView.webContents.destroy();
    this.browserView = null;
  }
}

export default BaseDialog;
