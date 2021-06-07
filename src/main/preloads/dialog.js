import { DIALOG_EVENTS } from 'constants/event-names';
import { ipcRenderer, webFrame } from 'electron';

const windowId = ipcRenderer.sendSync('get-current-window-id');

(async () => {
  const dialogId = await ipcRenderer.sendSync('get-webcontents-id');

  window.addEventListener('blur', () => {
    ipcRenderer.send(DIALOG_EVENTS.HIDE_DIALOG, dialogId);
  });

  const w = await webFrame.executeJavaScript('window');
  w.windowId = windowId;
})();
