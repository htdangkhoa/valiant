import { systemPreferences, session, BrowserWindow } from 'electron';
import logger from 'common/logger';
import PermissionDialog from 'main/dialogs/PermissionDialog';

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

    this.view.setPermissionRequestHandler(async (webContents, permission, callback, details) => {
      logger.log(webContents.id, permission);

      const win = BrowserWindow.getFocusedWindow();

      if (!win) return;
      const url = new URL(details.requestingUrl);

      // const id = dialog.showMessageBoxSync(win, {
      //   type: 'question',
      //   message: `${url.hostname} wants to:`,
      //   detail: permission,
      //   buttons: ['Allow', 'Block'],
      // });

      // callback(id === 0);

      const result = await this.requestPermission();
      callback(result === 1);
    });
  }

  requestPermission() {
    return new Promise((resolve) => {
      const dialog = new PermissionDialog();

      dialog.on('result', (e, result) => {
        logger.log(result);
        resolve(result);
        dialog.hide();
      });

      dialog.show({ focus: true });
    });
  }
}

export default SessionManager;
