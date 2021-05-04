import { app, ipcMain, BrowserWindow, BrowserView } from 'electron';
import { CLOSE_TAB, CLOSE_WINDOW, NEW_TAB, SWITCH_TAB, TAB_EVENTS } from 'root/constants/event-names';
import View from './View';

class ViewManager {
  constructor(appWindow) {
    this.appWindow = appWindow;

    this.win = appWindow.win;

    this.views = new Map();

    ipcMain.on(NEW_TAB, () => this.create({ url: 'https://google.com' }));

    ipcMain.on(SWITCH_TAB, (e, message) => {
      const { id } = message;

      const { browserView } = this.getView.apply(this, [id]);

      this.win.setBrowserView(browserView);

      this.selected = id;
    });

    ipcMain.on(CLOSE_TAB, async (e, message) => {
      const { id } = message;

      const { browserView } = this.getView.apply(this, [id]);

      this.win.removeBrowserView(browserView);

      browserView.webContents.destroy();

      this.views.delete(id);
    });

    ipcMain.on(CLOSE_WINDOW, () => {
      this.win.close();
    });
  }

  async create(
    options = {
      url: 'about:blank',
    },
  ) {
    const view = new View(this.appWindow, options);
    this.views.set(view.id, view);

    this.selected = view.id;

    this.win.webContents.send(TAB_EVENTS, 'create-tab', view.id);

    this.fixBounds();

    this.setBoundsListener();

    return view;
  }

  async fixBounds() {
    const view = this.views.get(this.selected);

    if (!view) return;

    const { browserView } = view;

    const { width, height } = this.win.getContentBounds();

    const toolbarContentHeight = await this.win.webContents.executeJavaScript(
      `document.getElementById('toolbar').offsetHeight`,
    );

    const newBounds = {
      x: 0,
      y: toolbarContentHeight,
      width,
      height: height - toolbarContentHeight,
    };

    if (newBounds !== browserView.getBounds()) {
      browserView.setBounds(newBounds);
    }
  }

  setBoundsListener() {
    this.win.webContents.executeJavaScript(`
        const { ipcRenderer } = require('electron');
        const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
          ipcRenderer.send('resize-height');
        });
        const toolbar = document.getElementById('toolbar');
        resizeObserver.observe(toolbar);
      `);

    this.win.webContents.on('ipc-message', (e, message) => {
      if (message === 'resize-height') {
        this.fixBounds();
      }
    });
  }

  getView(id) {
    return this.views.get(id);
  }
}

export default ViewManager;
