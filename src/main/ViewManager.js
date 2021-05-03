import { app, ipcMain, BrowserWindow, BrowserView } from 'electron';
import { CLOSE_TAB, FETCH_BROWSER_VIEWS, NEW_TAB, SWITCH_TAB, TAB_EVENTS } from 'root/constants/event-names';
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

      this.fetchTabs();
    });

    ipcMain.on(CLOSE_TAB, async (e, message) => {
      let keys = Array.from(this.views.keys());

      const { id } = message;

      const view = this.views.get(id);

      const indexKey = keys.indexOf(id);

      if (indexKey === -1) return;

      async function removeTab() {
        this.win.removeBrowserView(view);

        view.browserView.webContents.destroy();

        this.views.delete(id);

        await this.fetchTabs();
      }

      function setActiveToAnotherTab(key) {
        const v = this.views.get(key);

        this.selected = key;

        this.win.setBrowserView(v.browserView);
      }

      keys = Array.from(this.views.keys());

      if (indexKey === keys.length - 1) {
        const previousKey = keys[indexKey - 1];

        if (!previousKey) {
          await removeTab.apply(this);

          app.quit();

          return;
        }

        setActiveToAnotherTab.apply(this, [previousKey]);

        await removeTab.apply(this);

        return;
      }

      const nextKey = keys[indexKey + 1];

      setActiveToAnotherTab.apply(this, [nextKey]);

      await removeTab.apply(this);
    });
  }

  async create(
    options = {
      url: 'about:blank',
    },
  ) {
    const view = new View(this.appWindow, options, this.fetchTabs.bind(this));
    this.views.set(view.id, view);

    this.selected = view.id;

    this.setBoundsListener();

    await this.fetchTabs();

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

  async fetchTabs() {
    await this.fixBounds();

    const tabs = Array.from(this.views.keys()).map((key) => ({
      id: key,
      active: this.selected === key,
      title: this.views.get(key).browserView.title,
    }));

    this.appWindow.updateTitle();

    this.win.webContents.send(TAB_EVENTS, FETCH_BROWSER_VIEWS, tabs);
  }

  getView(id) {
    return this.views.get(id);
  }
}

export default ViewManager;
