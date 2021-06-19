import { session, BrowserWindow } from 'electron';
import prettyBytes from 'pretty-bytes';

class SessionManager {
  constructor() {
    this.view = session.fromPartition('persist:view');

    // this.view.clearCache().catch(console.error);
    // this.view.clearStorageData({
    //   storages: [
    //     'appcache',
    //     'cookies',
    //     'filesystem',
    //     'indexdb',
    //     'localstorage',
    //     'shadercache',
    //     'websql',
    //     'serviceworkers',
    //     'cachestorage',
    //   ],
    // });

    this.view.on('will-download', (e, item, _webContents) => {
      // item.savePath()

      // item.setSaveDialogOptions

      const win = BrowserWindow.getFocusedWindow();

      if (!win) return;

      // const defaultPath = `${item.getSavePath()}/${item.getFilename()}`;
      // console.log('🚀 ~ file: SessionsManager.js ~ line 32 ~ SessionManager ~ this.view.on ~ defaultPath', defaultPath);

      // dialog.showSaveDialog(win, { defaultPath }).then((result) => {
      //   console.log(result);
      //   item.emit('')
      // });

      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed');
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused');
          } else {
            console.log(`Total size: ${prettyBytes(item.getTotalBytes())}`);
            console.log(`Received bytes: ${prettyBytes(item.getReceivedBytes())}`);
          }
        }
      });

      item.once('done', (event, state) => {
        if (state === 'completed') {
          console.log('Download successfully');
        } else {
          console.log(`Download failed: ${state}`);
        }
      });
    });
  }
}

export default SessionManager;
