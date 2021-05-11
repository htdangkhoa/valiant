import View from './View';

class ViewManager {
  constructor(window) {
    this.views = new Map();

    this.window = window;
  }

  create(options = { url: 'about:blank', appendToLast: false }) {
    const opts = Object.assign({}, options);

    const view = new View({ url: opts.url, appendToLast: opts.appendToLast });
    this.views.set(view.id, view);

    return view;
  }

  selectView(id) {
    const view = this.views.get(id);
    view.update();

    Array.from(this.views.values()).forEach((v) => {
      v.active = v.id === id;
    });
  }

  destroyView(id) {
    const view = this.views.get(id);

    view.destroy();
    this.views.delete(id);
  }
}

export default ViewManager;
