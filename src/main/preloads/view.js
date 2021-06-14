import { ipcRenderer, webFrame } from 'electron';
import { injectChromeWebStoreInstallButton } from 'main/core/chrome-webstore';

const browserViewId = ipcRenderer.sendSync('get-webcontents-id').toString();

(async () => {
  const w = await webFrame.executeJavaScript('window');
  w.errorUrl = await ipcRenderer.invoke(`get-error-url-${browserViewId}`);
})();

if (window.location.host === 'chrome.google.com') {
  injectChromeWebStoreInstallButton();
}

ipcRenderer.on(`${browserViewId}-leave-full-screen`, () =>
  (typeof document.webkitExitFullscreen === 'function' ? document.webkitExitFullscreen : document.exitFullscreen)(),
);
