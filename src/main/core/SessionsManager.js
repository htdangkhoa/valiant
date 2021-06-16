import { session } from 'electron';

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
  }
}

export default SessionManager;
