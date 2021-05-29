const { default: BaseDialog } = require('./BaseDialog');

const WIDTH = 320;

const MARGIN = 8;

class SettingsDialog extends BaseDialog {
  constructor() {
    super('settings', 'btn-quick-menu');
  }

  onDraw(contentHeight, rect) {
    return { x: rect.right - (WIDTH - MARGIN), y: rect.bottom - 2, width: WIDTH, height: contentHeight + MARGIN * 2 };
  }
}

export default SettingsDialog;
