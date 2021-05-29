import SettingsDialog from '../dialogs/SettingsDialog';
import Window from './Window';
import { runAdblock } from '../network/adblock';

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

    this.dialogs = {
      settings: new SettingsDialog(),
    };

    // TODO: the settings will be loaded at here.
    runAdblock();
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

  closeWindow(id) {
    const window = this.windows.get(id);
    if (!window) return;
    window.win.close();
    window.win = null;
    this.windows.delete(id);
  }
}

export default AppInstance;
