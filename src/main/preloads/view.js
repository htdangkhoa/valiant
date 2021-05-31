import { ipcRenderer, webFrame } from 'electron';

console.log('preload', 'ping');

const browserViewId = ipcRenderer.sendSync('get-webcontents-id').toString();

console.log(browserViewId);

(async () => {
  const w = await webFrame.executeJavaScript('window');
  w.errorUrl = await ipcRenderer.invoke(`get-error-url-${browserViewId}`);

  // w.addEventListener(
  //   'wheel',
  //   (e) => {
  //     console.log('ldasjdkasjlkdajsklj');
  //     ipcRenderer.send(browserViewId, 'wheel', { x: e.deltaX, y: e.deltaY });
  //   },
  //   {
  //     passive: true,
  //   },
  // );
})();
