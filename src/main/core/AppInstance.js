import { ipcMain } from 'electron';
import { DIALOG_EVENTS } from 'constants/event-names';

import SettingsDialog from '../dialogs/SettingsDialog';
import SuggestionDialog from '../dialogs/SuggestionDialog';
import Window from './Window';
import { runAdblock } from '../network/adblock';
import SessionsManager from './SessionsManager';

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

    this.sessions = new SessionsManager();

    this.dialogs = {
      settings: new SettingsDialog(),
      suggestion: new SuggestionDialog(),
    };

    // TODO: the settings will be loaded at here.
    runAdblock();

    ipcMain.on(DIALOG_EVENTS.HIDE_ALL_DIALOG, () => {
      this.hideAllDialog();
    });
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

  showDialog(name, options = { showDevTools: false, focus: true }) {
    return this.dialogs[name].show(options);
  }

  hideAllDialog() {
    Object.values(this.dialogs).forEach((dialog) => {
      if (dialog.isOpening) dialog.hide();
    });
  }
}

export default AppInstance;
