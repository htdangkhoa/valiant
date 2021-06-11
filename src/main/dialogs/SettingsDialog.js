import { DIALOG } from 'constants/theme';
import { VIEW_SETTINGS } from 'constants/view-names';

import BaseDialog from './BaseDialog';

const WIDTH = 320;

class SettingsDialog extends BaseDialog {
  constructor() {
    super(VIEW_SETTINGS, { targetElement: 'btn-quick-menu' });
  }

  onDraw(contentHeight, rect) {
    return {
      x: rect.right - (WIDTH - DIALOG.MARGIN),
      y: rect.bottom - 2,
      width: WIDTH,
      height: contentHeight + DIALOG.MARGIN * 2,
    };
  }
}

export default SettingsDialog;
