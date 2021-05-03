import { BrowserView, Menu, clipboard, Event, ContextMenuParams, MenuItem } from 'electron';
import { isURL } from 'root/common';
import { v4 as uuid } from 'uuid';

class View {
  constructor(appWindow, options = { url: 'about:blank' }) {
    const opts = Object.assign({}, options);

    this.appWindow = appWindow;

    this.win = appWindow.win;

    this.browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        plugins: true,
        nativeWindowOpen: true,
        webSecurity: true,
        javascript: true,
        worldSafeExecuteJavaScript: false,
      },
    });
    this.browserView.id = uuid();
    this.win.addBrowserView(this.browserView);
    this.browserView.setBackgroundColor('#ffffff');
    this.browserView.webContents.loadURL(opts.url);
    this.browserView.setAutoResize({ width: true, height: true, vertical: true, horizontal: true });
    this.browserView.webContents.on('context-menu', this.registerContextMenu.bind(this));
    this.browserView.webContents.addListener('new-window', (e, url, frameName, disposition) => {
      if (disposition === 'new-window') {
        if (frameName === '_self') {
          e.preventDefault();
          this.webContents.loadURL(url);
        } else if (frameName === '_blank') {
          e.preventDefault();
          this.appWindow.viewManager.create({ url });
        }
      } else if (disposition === 'foreground-tab') {
        e.preventDefault();
        this.appWindow.viewManager.create({ url });
      } else if (disposition === 'background-tab') {
        e.preventDefault();
        this.appWindow.viewManager.create({ url });
      }
    });
  }

  get id() {
    return this.browserView.id;
  }

  get webContents() {
    return this.browserView.webContents;
  }

  registerContextMenu(event, params) {
    event.preventDefault();

    const { viewManager } = this.appWindow;

    // let menuItems: MenuItem[] = [];
    let menuItems = [];

    if (params.linkURL) {
      menuItems = menuItems.concat([
        {
          label: 'Open Link in New Tab',
          click: () => {
            viewManager.create({ url: params.linkURL });
          },
        },
        { label: 'Open Link in Incognito Window' },
        { type: 'separator' },
        {
          label: 'Copy Link Address',
          click: () => {
            clipboard.clear();
            clipboard.writeText(params.linkURL);
          },
        },
        { type: 'separator' },
      ]);
    }

    if (params.hasImageContents) {
      menuItems = menuItems.concat([
        {
          label: 'Open Image in New Tab',
          click: () => {
            viewManager.create({ url: params.srcURL });
          },
        },
        {
          label: 'Copy Image',
          click: () => {
            this.webContents.copyImageAt(params.x, params.y);
          },
        },
        {
          label: 'Copy Image Address',
          click: () => {
            clipboard.clear();
            clipboard.writeText(params.srcURL);
          },
        },
        { type: 'separator' },
      ]);
    }

    if (params.isEditable) {
      menuItems = menuItems.concat([
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteAndMatchStyle' },
        { role: 'selectAll' },
        { type: 'separator' },
      ]);
    }

    if (!params.isEditable && params.selectionText) {
      menuItems = menuItems.concat([{ role: 'copy' }]);
    }

    if (params.selectionText) {
      const trimmedText = params.selectionText.trim();

      if (isURL(trimmedText)) {
        menuItems = menuItems.concat([
          {
            label: `Go to '${trimmedText}'`,
            click: () => {
              viewManager.create({ url: trimmedText });
            },
          },
          { type: 'separator' },
        ]);
      }

      menuItems = menuItems.concat([
        {
          label: 'Search with Google',
          click: () => {
            viewManager.create({ url: `https://google.com/search?q=${trimmedText}` });
          },
        },
        { type: 'separator' },
      ]);
    }

    // TODO
    if (!params.hasImageContents && params.linkURL === '' && params.selectionText === '' && !params.isEditable) {
      menuItems = menuItems.concat([
        {
          label: 'Back',
          enabled: this.webContents.canGoBack(),
          click: () => {
            this.webContents.goBack();
          },
        },
        {
          label: 'Forward',
          enabled: this.webContents.canGoForward(),
          click: () => {
            this.webContents.goForward();
          },
        },
        {
          label: 'Reload',
          click: () => {
            this.webContents.reload();
          },
        },
        { type: 'separator' },
        { label: 'Save As...' },
        { label: 'Print...' },
        { type: 'separator' },
        { label: 'View Page Source' },
        { type: 'separator' },
      ]);
    }

    menuItems = menuItems.concat([
      {
        label: 'Inspect Element',
        click: () => this.webContents.inspectElement(params.x, params.y),
      },
    ]);

    const menu = Menu.buildFromTemplate(menuItems);

    menu.popup();
  }
}

export default View;
