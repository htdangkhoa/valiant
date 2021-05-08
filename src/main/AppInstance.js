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
  }

  createWindow(options = { incognito: false, view: null }) {
    const window = new Window(options);

    this.windows.set(window.id, window);

    window.win.on('focus', () => {
      this.focusedWindow = window;
    });

    return window;
  }
}

export default AppInstance;
