import { ipcRenderer } from 'electron';

(async () => {
  const windowId = await ipcRenderer.invoke('get-window-id');

  window.windowId = windowId;
})();
