import { isURL } from 'common';
import logger from 'common/logger';
import { DIALOG } from 'constants/theme';
import { VIEW_SUGGESTION } from 'constants/view-names';
import { ipcMain } from 'electron';
import request from 'main/network/request';
import BaseDialog from './BaseDialog';

class SuggestionDialog extends BaseDialog {
  constructor() {
    super(VIEW_SUGGESTION, 'address-bar', { autoHide: true });

    this.browserView.setAutoResize({ width: true, height: true });

    ipcMain.on(`fetch2`, async (e, message) => {
      /**
       * index 0: Lilo
       *
       * index 1: Yahoo, Bing, Google, Yandex, Wikipedia
       *
       * Duckduckgo: [{ phrase: "tinhte" }, ...]
       *
       * Qwant: { data: { items: [{ value: "google.com", suggestType: 12 }, ...] } }
       */

      let result = [];

      if (isURL(message)) {
        result.push({ text: message });
      }

      result.push({ text: message, searchWithEngine: true });

      try {
        const { data } = await request(
          `https://www.google.com/complete/search?client=chrome&q=${encodeURIComponent(message)}`,
        );

        const res = JSON.parse(data);

        const [, suggestions] = res;

        result = result.concat(...[].concat(suggestions).map((text) => ({ text })));
      } catch (error) {
        logger.error(error);
      } finally {
        this.show({ showDevTools: false, focus: true });

        // this.webContents.send('receive-suggestions', result);

        e.returnValue = result;
      }
    });
  }

  onDraw(contentHeight, rect) {
    return {
      x: rect.left - DIALOG.MARGIN,
      y: rect.top - DIALOG.MARGIN,
      width: rect.width + DIALOG.MARGIN * 2,
      height: contentHeight,
    };
  }
}

export default SuggestionDialog;
