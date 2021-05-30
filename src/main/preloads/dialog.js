import { DIALOG_EVENTS } from 'constants/event-names';
import { ipcRenderer } from 'electron';

(async () => {
  const dialogId = await ipcRenderer.sendSync('get-webcontents-id');

  window.addEventListener('blur', () => {
    ipcRenderer.send(DIALOG_EVENTS.HIDE_DIALOG, dialogId);
  });
})();
