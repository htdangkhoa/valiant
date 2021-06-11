const baseUrl =
  'https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&prodversion=%VERSION&x=id%3D%ID%26installsource%3Dondemand%26uc';

const btnDownloadText = 'Add to Valiant';

export const injectChromeWebStoreInstallButton = () => {
  const waitForDetail = (callback) => {
    const element = document.querySelector('.h-F-f-k.F-f-k');

    if (element) {
      callback(element);
    } else {
      setTimeout(() => {
        waitForDetail(callback);
      }, 50);
    }
  };

  const installExtension = () => {
    const extensionId = document.URL.match(/(?<=\/)(\w+)(\?|$)/)[1];

    const chromeVersion = navigator.userAgent.match(/(?<=Chrome\/)\d+\.\d+/)[0];

    window.location.href = baseUrl.replace('%VERSION', chromeVersion).replace('%ID', extensionId);
  };

  const makeInstallButton = (container) => {
    if (!container) return;

    container.innerHTML = `
      <div role="button" class="dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c" aria-label="${btnDownloadText}" style="user-select: none;" tabindex="0">
        <div class="g-c-Hf">
          <div class="g-c-x">
            <div class="g-c-R  webstore-test-button-label">${btnDownloadText}</div>
          </div>
        </div>
      </div>
    `;

    const DOM = container.children[0];
    DOM.addEventListener('mouseover', () => DOM.classList.add('g-c-l'));
    DOM.addEventListener('mouseout', () => DOM.classList.remove('g-c-l', 'g-c-Bd'));
    DOM.addEventListener('mousedown', () => DOM.classList.add('g-c-Bd', 'g-c-Xc', 'g-c-Sc-ci'));
    DOM.addEventListener('mouseup', () => DOM.classList.remove('g-c-Bd', 'g-c-Xc', 'g-c-Sc-ci'));
    DOM.addEventListener('blur', () => {
      DOM.className = 'dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c';
    });
    DOM.addEventListener('click', installExtension);
  };

  waitForDetail((element) => {
    element.addEventListener('DOMNodeInserted', (e) => {
      if (e.relatedNode !== element) return;

      const rightPane = document.querySelector('.h-e-f-Ra-c.e-f-oh-Md-zb-k');
      makeInstallButton(rightPane);
    });
  });
};
