import { DIALOG } from 'constants/theme';
import { VIEW_PERMISSION } from 'constants/view-names';
import BaseDialog from './BaseDialog';

const WIDTH = 320;

class PermissionDialog extends BaseDialog {
  constructor() {
    super(VIEW_PERMISSION, { autoHide: false, targetElement: 'address-bar' });
  }

  onDraw(contentHeight, rect) {
    return {
      x: rect.left - DIALOG.MARGIN,
      y: rect.bottom - DIALOG.MARGIN,
      width: WIDTH + DIALOG.MARGIN * 2,
      height: contentHeight,
    };
  }
}

export default PermissionDialog;
