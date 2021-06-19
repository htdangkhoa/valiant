import { VIEW_DOWNLOAD_MANAGER } from 'constants/view-names';
import BaseDialog from './BaseDialog';

class DownloadManagerDialog extends BaseDialog {
  constructor() {
    super(VIEW_DOWNLOAD_MANAGER, { autoHide: false });
  }

  onDraw(contentHeight) {
    const bounds = this.window.win.getBounds();

    this.window.fixBounds(contentHeight);

    return { x: 0, y: bounds.height - contentHeight, width: bounds.width, height: contentHeight };
  }

  hide() {
    this.window.fixBounds(0);

    super.hide();
  }
}

export default DownloadManagerDialog;
