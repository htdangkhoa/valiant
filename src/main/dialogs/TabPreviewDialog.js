import { VIEW_TAB_PREVIEW } from 'constants/view-names';
import BaseDialog from './BaseDialog';

class TabPreviewDialog extends BaseDialog {
  constructor(dynamicBounds) {
    super(VIEW_TAB_PREVIEW, { autoHide: false, dynamicBounds });
  }
}

export default TabPreviewDialog;
