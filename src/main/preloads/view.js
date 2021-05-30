import { ipcRenderer, webFrame } from 'electron';

console.log('preload', 'ping');

const browserViewId = ipcRenderer.sendSync('get-webcontents-id');

console.log(browserViewId);

(async () => {
  const w = await webFrame.executeJavaScript('window');
  w.errorUrl = await ipcRenderer.invoke(`get-error-url-${browserViewId}`);
})();
