import { DIALOG } from 'constants/theme';
import { VIEW_FIND } from 'constants/view-names';
import BaseDialog from './BaseDialog';

const WIDTH = 350;

class FindDialog extends BaseDialog {
  constructor() {
    super(VIEW_FIND, { autoHide: false, targetElement: 'toolbar' });
  }

  onDraw(contentHeight, rect) {
    return {
      x: rect.right - WIDTH - DIALOG.MARGIN / 2,
      y: rect.bottom,
      width: WIDTH,
      height: 56,
    };
  }
}

export default FindDialog;
