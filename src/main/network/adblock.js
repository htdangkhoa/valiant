import { session } from 'electron';
import { ElectronBlocker, fullLists } from '@cliqz/adblocker-electron';
import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { getPath } from 'common';
import logger from 'common/logger';

// const instance = AppInstance.getInstance();

let blocker;

const emitEvent = (request) => {
  // for (let i = 0; i < instance.windows.length; i += 1) {
  //   const window = instance.windows[i];
  //   window.webContents.send(`blocked-ad-${request.tabId}`);
  // }
};

export const runAdblock = async () => {
  blocker = await ElectronBlocker.fromLists(
    fetch,
    fullLists,
    { enableCompression: true },
    {
      path: getPath('.bin/engine.bin'),
      read: fs.readFile,
      write: fs.writeFile,
    },
  );

  blocker.enableBlockingInSession(session.defaultSession);

  blocker.on('request-blocked', (request) => {
    logger.log('blocked', request.tabId, request.url);

    // emitEvent(request);
  });

  blocker.on('request-redirected', (request) => {
    logger.log('redirected', request.tabId, request.url);

    // emitEvent(request);
  });

  blocker.on('request-whitelisted', (request) => {
    logger.log('whitelisted', request.tabId, request.url);
  });

  blocker.on('csp-injected', (request) => {
    logger.log('csp', request.url);
  });

  blocker.on('script-injected', (script, url) => {
    logger.log('script', script.length, url);
  });

  blocker.on('style-injected', (style, url) => {
    logger.log('style', style.length, url);
  });
};
