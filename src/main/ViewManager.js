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

  create(options = { url: 'about:blank', nextTo: undefined, active: false }) {
    const latestView = this.views.get(this.selected);

    if (latestView) {
      this.window.win.removeBrowserView(latestView.browserView);
      this.selected = null;
    }

    const opts = Object.assign({}, options);

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
    const view = this.views.get(id);
    if (!view) return;
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
