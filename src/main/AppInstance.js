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

    window.win.on('focus', () => {
      this.focusedWindow = window;
    });

    return window;
  }
}

export default AppInstance;