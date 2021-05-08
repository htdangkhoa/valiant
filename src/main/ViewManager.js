import { app, ipcMain, BrowserWindow, BrowserView } from 'electron';
import { TAB_EVENTS } from 'root/constants/event-names';
import View from './View';

class ViewManager {
  constructor(window) {
    this.window = window;

    this.views = new Map();
  }

  setSelected(id) {
    this.selected = id;
  }

  create(options = { url: 'about:blank' }) {
    const view = new View(this.window, options);
    this.views.set(view.id, view);

    this.selected = view.id;

    this.window.webContents.send(TAB_EVENTS.RENDERER, 'create-tab', view.id);
    this.fixBounds();
    this.setBoundsListener();

    return view;
  }

  getView(id) {
    return this.views.get(id);
  }

  getCurrentView() {
    if (!this.selected) return null;

    return this.getView(this.selected);
  }

  async fixBounds() {
    const view = this.getCurrentView();

    if (!view) return;

    const { browserView } = view;

    const { win, webContents } = this.window;

    const { width, height } = win.getContentBounds();

    const toolbarContentHeight = await webContents.executeJavaScript(`document.getElementById('toolbar').offsetHeight`);

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
    const { webContents } = this.window;

    webContents.executeJavaScript(`
        var { ipcRenderer } = require('electron');
        var resizeObserver = new ResizeObserver(([{ contentRect }]) => {
          ipcRenderer.send('resize-height');
        });
        var toolbar = document.getElementById('toolbar');
        resizeObserver.observe(toolbar);
      `);

    webContents.on('ipc-message', (e, message) => {
      if (message === 'resize-height') {
        this.fixBounds();
      }
    });
  }
}

export default ViewManager;
