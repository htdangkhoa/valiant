import { ipcRenderer } from 'electron';

export const callWebContentsMethod = (id, method, ...args) =>
  ipcRenderer.invoke('webcontents-call', {
    args,
    method,
    webContentsId: id,
  });
