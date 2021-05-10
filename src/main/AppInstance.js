import { Menu, dialog } from 'electron';
import ViewManager from './ViewManager';
import Window from './Window';

// singleton
let appInstance;

class AppInstance {
  static initialize() {
    if (!appInstance) {
      appInstance = new AppInstance();
    }

    return appInstance;
  }

  static getInstance() {
    return appInstance;
  }

  constructor() {
    this.windows = new Map();

    this.focusedWindow = null;

    this.viewManager = new ViewManager(this);
  }

  createWindow(options = { incognito: false, view: null }) {
    const window = new Window(options);

    this.focusedWindow = window;

    this.windows.set(window.id, window);

    // this.viewManager.create();

    window.win.on('focus', () => {
      this.focusedWindow = window;
    });

    const menu = Menu.buildFromTemplate([
      {
        label: 'Move to New Window',
        click: () => {
          // const message = JSON.stringify(Array.from(this.viewManager.views.values()));
          // dialog.showMessageBox(this.focusedWindow.win, { message });
          const view = Array.from(this.viewManager.views.values())[0];
          this.createWindow({ view });
        },
      },
    ]);
    window.webContents.on('context-menu', (e) => {
      e.preventDefault();

      menu.popup(window.webContents);
    });

    return window;
  }
}

export default AppInstance;
