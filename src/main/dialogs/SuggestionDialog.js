import { DIALOG_MARGIN } from 'constants/theme';
import { VIEW_SUGGESTION } from 'constants/view-names';
import BaseDialog from './BaseDialog';

const HEIGHT = 250;

class SuggestionDialog extends BaseDialog {
  constructor() {
    super(VIEW_SUGGESTION, 'address-bar');
  }

  onDraw(contentHeight, rect) {
    return { x: rect.left - DIALOG_MARGIN, y: rect.bottom, width: rect.width + DIALOG_MARGIN * 2, height: HEIGHT };
  }
}

export default SuggestionDialog;
