import { ipcMain } from 'electron';
import { DIALOG_EVENTS } from 'constants/event-names';

import SettingsDialog from '../dialogs/SettingsDialog';
import SuggestionDialog from '../dialogs/SuggestionDialog';
import FindDialog from '../dialogs/FindDialog';

import Window from './Window';
import { runAdblock } from '../network/adblock';
import SessionsManager from './SessionsManager';
import appMenu from '../menus/app';

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
      find: new FindDialog(),
    };

    // TODO: the settings will be loaded at here.
    runAdblock(this);

    ipcMain.on(DIALOG_EVENTS.HIDE_ALL_DIALOG, (e, ...args) => {
      this.hideAllDialog(...args);
    });

    appMenu(this);
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

  findViewById(id) {
    return Array.from(this.windows.values()).find((x) => !!x.viewManager.views.get(id));
  }

  getDialog(name) {
    return this.dialogs[name];
  }

  showDialog(name, options = { showDevTools: false, focus: true }) {
    return this.dialogs[name].show(options);
  }

  hideDialog(name) {
    return this.dialogs[name].hide();
  }

  hideAllDialog(...ignoreNames) {
    Object.keys(this.dialogs)
      .filter((k) => !ignoreNames.includes(k))
      .forEach((k) => {
        const dialog = this.dialogs[k];

        if (dialog.isOpening) dialog.hide();
      });
  }
}

export default AppInstance;
