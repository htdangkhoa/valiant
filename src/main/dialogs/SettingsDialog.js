import { DIALOG_MARGIN } from 'constants/theme';
import { VIEW_SETTINGS } from 'constants/view-names';

import BaseDialog from './BaseDialog';

const WIDTH = 320;

class SettingsDialog extends BaseDialog {
  constructor() {
    super(VIEW_SETTINGS, 'btn-quick-menu');
  }

  onDraw(contentHeight, rect) {
    return {
      x: rect.right - (WIDTH - DIALOG_MARGIN),
      y: rect.bottom - 2,
      width: WIDTH,
      height: contentHeight + DIALOG_MARGIN * 2,
    };
  }
}

export default SettingsDialog;
