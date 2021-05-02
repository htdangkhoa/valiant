import { BrowserView, Menu } from 'electron';

class View {
  constructor(win, options = { url: '' }) {
    this.win = win;
    // eslint-disable-next-line prefer-object-spread
    const opts = Object.assign({}, options);

    this.view = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        plugins: true,
        nativeWindowOpen: true,
        webSecurity: true,
        javascript: true,
        worldSafeExecuteJavaScript: false,
        navigateOnDragDrop: false,
      },
    });
    this.win.addBrowserView(this.view);

    this.view.setBackgroundColor('#ffffff');
    this.view.webContents.loadURL(opts.url);

    this.resize();
    this.win.on('resize', this.resize.bind(this));

    this.registerMenu();

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

      contextMenu.popup();
    });
  }

  async resize() {
    const tabBarHeight = await this.win.webContents.executeJavaScript(
      `document.getElementById('toolbar').offsetHeight`,
    );

    this.view.setBounds({
      x: 0,
      y: tabBarHeight,
      width: this.win.getBounds().width,
      height: this.win.getBounds().height - tabBarHeight,
    });

    // fix the BrowserView can draggable
    const bounds = this.win.getContentBounds();
    this.win.setContentBounds({ y: tabBarHeight, height: bounds.height + 1 });
    this.win.setContentBounds(bounds);
  }
}

export default View;
