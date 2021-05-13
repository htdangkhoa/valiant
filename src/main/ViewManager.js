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

  create(options = { url: 'about:blank', nextTo: undefined }) {
    const opts = Object.assign({}, options);

    const hasNextTo = typeof opts.nextTo === 'number';

    const view = new View({ url: opts.url, nextTo: hasNextTo ? opts.nextTo : this.views.size });

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

    this.selected = view.id;

    return view;
  }

  selectView(id) {
    const view = this.views.get(id);
    this.selected = view.id;
    view.update();
  }

  destroyView(id) {
    const view = this.views.get(id);

    view.destroy();
    this.views.delete(id);
    this.selected = null;
  }
}

export default ViewManager;
