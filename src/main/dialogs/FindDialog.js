import { DIALOG } from 'constants/theme';
import { VIEW_FIND } from 'constants/view-names';
import { ipcMain } from 'electron';
import BaseDialog from './BaseDialog';

const WIDTH = 350;

class FindDialog extends BaseDialog {
  constructor() {
    super(VIEW_FIND, { autoHide: false, targetElement: 'toolbar' });

    this.lastValue = '';

    ipcMain.on(`${this.id}-hide`, () => this.hide());

    ipcMain.on(`${this.id}-update-last-value`, (e, value) => {
      this.lastValue = value;
    });
  }

  onDraw(contentHeight, rect) {
    return {
      x: rect.right - WIDTH - DIALOG.MARGIN / 2,
      y: rect.bottom,
      width: WIDTH,
      height: 56,
    };
  }

  show(options) {
    this.emit('focus');

    super.show(options);
  }
}

export default FindDialog;
