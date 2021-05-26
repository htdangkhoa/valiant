import { ipcRenderer } from 'electron';

console.log('preload', 'ping');

ipcRenderer.sendSync('get-webcontents-id');
