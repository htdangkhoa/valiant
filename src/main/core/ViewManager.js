import View from './View';

class ViewManager {
  constructor(window) {
    this.views = new Map();

    this.window = window;

    this.selected = null;
  }

  get ids() {
    return Array.from(this.views.keys());
  }

  get selectedView() {
    return this.views.get(this.selected);
  }

  create(options = { url: 'about:blank', nextTo: undefined, active: false }) {
    const opts = Object.assign({}, options);

    if (opts.active) {
      const latestView = this.views.get(this.selected);

      if (latestView) {
        this.window.win.removeBrowserView(latestView.browserView);
        latestView.hidePermissionDialog();
        latestView.webContents.session.setPermissionRequestHandler(null);
      }
    }

    const hasNextTo = typeof opts.nextTo === 'number';

    const view = new View({
      url: opts.url,
      nextTo: hasNextTo ? opts.nextTo : this.views.size,
      active: opts.active,
    });

    if (hasNextTo) {
      const entries = Array.from(this.views.entries());

      entries.splice(opts.nextTo, 0, [view.id, view]);

      this.views = entries.reduce((map, [k, v]) => {
        map.set(k, v);

        return map;
      }, new Map());
    } else {
      this.views.set(view.id, view);
    }

    if (opts.active) {
      this.selected = view.id;
    }

    return view;
  }

  selectView(id) {
    if (this.selected === id) return;

    this.selectedView.hidePermissionDialog();
    this.selectedView.webContents.session.setPermissionRequestHandler(null);

    const view = this.views.get(id);
    if (!view) return;

    view.checkFindInPage();

    if (view.permissionDialog) {
      view.permissionDialog.show();
    }

    this.window.win.removeBrowserView(view.browserView);
    this.selected = view.id;
    view.render({ active: true });
  }

  destroyView(id) {
    const view = this.views.get(id);

    view.destroy();
    this.views.delete(id);
    this.selected = null;
  }

  swapView(from, to) {
    Array.from(this.views.values()).forEach((v) => {
      v.hideTabPreviewDialog();
    });

    const entries = Array.from(this.views.entries());

    if (typeof from !== 'number' || from < 0) return;

    const [valueFromIndex] = entries.splice(from, 1);

    entries.splice(to, 0, valueFromIndex);

    this.views = entries.reduce((map, [k, v]) => {
      map.set(k, v);

      return map;
    }, new Map());
  }
}

export default ViewManager;
