import { ipcMain } from 'electron';

import { DIALOG } from 'constants/theme';
import { VIEW_SUGGESTION } from 'constants/view-names';
import { isURL } from 'common';
import logger from 'common/logger';
import request from 'main/network/request';
import BaseDialog from './BaseDialog';

class SuggestionDialog extends BaseDialog {
  constructor() {
    super(VIEW_SUGGESTION, { targetElement: 'address-bar' });

    this.browserView.setAutoResize({ width: true, height: true });

    ipcMain.on('suggestion:forwarding-keydown', (e, key) => {
      if (this.isOpening) {
        this.webContents.send('suggestion:forwarding-keydown', key);
      }
    });

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

      this.show({ showDevTools: false, focus: false });

      let result = [];

      if (message.trim() === '') {
        e.returnValue = result;

        return;
      }

      if (isURL(message)) {
        result.push({ text: message });
      }

      result.push({ text: message, label: ' - Google Search', isSearchTerm: true });

      try {
        const { data } = await request(
          `https://www.google.com/complete/search?client=chrome&q=${encodeURIComponent(message)}`,
        );

        const res = JSON.parse(data);

        const [, suggestions] = res;

        result = result.concat(...[].concat(suggestions).map((text) => ({ text, isSearchTerm: true })));
      } catch (error) {
        logger.error(error);
      } finally {
        e.returnValue = result;
      }
    });
  }

  onDraw(contentHeight, rect) {
    return {
      x: rect.left - DIALOG.MARGIN,
      y: rect.bottom,
      width: rect.width + DIALOG.MARGIN * 2,
      height: contentHeight,
    };
  }
}

export default SuggestionDialog;
