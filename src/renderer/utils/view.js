import { ipcRenderer } from 'electron';

export const callWebContentsMethod = (id, method, ...args) =>
  ipcRenderer.invoke('web-contents-call', {
    args,
    method,
    webContentsId: id,
  });
