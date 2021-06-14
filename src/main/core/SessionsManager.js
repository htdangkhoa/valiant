import { session } from 'electron';
import logger from 'common/logger';

class SessionManager {
  constructor() {
    this.view = session.fromPartition('persist:view');

    // this.view.clearCache().catch(logger.error);
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
