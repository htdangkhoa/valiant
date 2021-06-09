import { session, BrowserWindow, dialog } from 'electron';
import logger from 'common/logger';

class SessionManager {
  constructor() {
    this.view = session.fromPartition('persist:view');

    this.view.clearCache().catch(console.error);
    this.view.clearStorageData({
      storages: [
        'appcache',
        'cookies',
        'filesystem',
        'indexdb',
        'localstorage',
        'shadercache',
        'websql',
        'serviceworkers',
        'cachestorage',
      ],
    });

    this.view.setPermissionRequestHandler((webContents, permission, callback, details) => {
      logger.log(webContents.id, permission);

      const win = BrowserWindow.getFocusedWindow();

      if (!win) return;
      const url = new URL(details.requestingUrl);

      const id = dialog.showMessageBoxSync(win, {
        type: 'question',
        message: `${url.hostname} wants to:`,
        detail: permission,
        buttons: ['Allow', 'Block'],
      });

      callback(id === 0);
    });
  }
}

export default SessionManager;
