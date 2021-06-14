import { ipcRenderer, webFrame } from 'electron';
import { injectChromeWebStoreInstallButton } from 'main/core/chrome-webstore';

console.log('preload', 'ping');

const browserViewId = ipcRenderer.sendSync('get-webcontents-id').toString();

console.log(browserViewId);

(async () => {
  const w = await webFrame.executeJavaScript('window');
  w.errorUrl = await ipcRenderer.invoke(`get-error-url-${browserViewId}`);
})();

if (window.location.host === 'chrome.google.com') {
  injectChromeWebStoreInstallButton();
}

ipcRenderer.on(`${browserViewId}-leave-full-screen`, () => {
  console.log(`${browserViewId}-leave-full-screen`);

  typeof document.webkitExitFullscreen === 'function' ? document.webkitExitFullscreen() : document.exitFullscreen();
});
