const { BrowserWindow, BrowserView, Menu } = require('electron');

class TabView {
  constructor(win, options = { url: '' }) {
    this.win = win;
    // eslint-disable-next-line prefer-object-spread
    const opts = Object.assign({}, options);

    this.view = new BrowserView({ webPreferences: { nodeIntegrationInSubFrames: false } });
    this.view.webContents.loadURL(opts.url);
    this.win.addBrowserView(this.view);
    this.win.setBrowserView(this.view);

    this.resize();
    // this.view.webContents.loadURL(opts.url);

    this.registerMenu();

    win.on('resize', this.resize.bind(this));

    return this.view;
  }

  registerMenu() {
    const { webContents } = this.view;

    webContents.on('context-menu', (e, param) => {
      e.preventDefault();

      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'Back',
          click: () => {
            if (webContents.canGoBack()) {
              webContents.goBack();
            }
          },
        },
        {
          label: 'Forward',
          click: () => {
            if (webContents.canGoForward()) {
              webContents.goForward();
            }
          },
        },
        { label: 'Reload', click: () => webContents.reload() },
        { type: 'separator' },
        { label: 'View Page Source' },
        { label: 'Inspect Element', click: () => webContents.inspectElement(param.x, param.y) },
      ]);

      contextMenu.popup(webContents);
    });
  }

  resize() {
    this.view.setBounds({ x: 0, y: 85, width: this.win.getBounds().width, height: this.win.getBounds().height - 85 });
  }
}

module.exports = TabView;
