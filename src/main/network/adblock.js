import { session } from 'electron';
import { ElectronBlocker, fullLists } from '@cliqz/adblocker-electron';
import fetch from 'node-fetch';
import { promises as fs, existsSync, mkdirSync } from 'fs';
import { getPath } from 'common';
import logger from 'common/logger';
import { TAB_EVENTS } from 'constants/event-names';

let blocker;

const emitEvent = (instance, request) => {
  const view = instance.findViewById(request.tabId.toString());

  if (!view) return;

  view.webContents.send(request.tabId.toString(), TAB_EVENTS.ADS_COUNTING);
};

export const runAdblock = async (instance) => {
  const adblockerEngineDir = getPath('.bin');

  if (!existsSync(adblockerEngineDir)) {
    mkdirSync(adblockerEngineDir);
  }

  blocker = await ElectronBlocker.fromLists(
    fetch,
    [
      ...fullLists,
      'https://raw.githubusercontent.com/deathbybandaid/piholeparser/master/Subscribable-Lists/CountryCodesLists/Vietnam.txt',
      'https://raw.githubusercontent.com/bigdargon/hostsVN/master/hosts',
    ],
    { enableCompression: true },
    {
      path: getPath('.bin/engine.bin'),
      read: fs.readFile,
      write: fs.writeFile,
    },
  );

  blocker.enableBlockingInSession(session.fromPartition('persist:view'));

  blocker.on('request-blocked', (request) => {
    logger.log('blocked', request.tabId, request.url);

    emitEvent(instance, request);
  });

  blocker.on('request-redirected', (request) => {
    logger.log('redirected', request.tabId, request.url);

    emitEvent(instance, request);
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
