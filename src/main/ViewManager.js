import View from './View';

class ViewManager {
  constructor(appInstance) {
    this.views = new Map();

    this.appInstance = appInstance;
  }

  create(options = { url: 'about:blank' }) {
    const opts = Object.assign({}, options);

    const view = new View({ url: opts.url, active: true });
    this.views.set(view.id, view);
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
