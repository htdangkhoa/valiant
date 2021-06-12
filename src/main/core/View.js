import { app, ipcMain, BrowserView } from 'electron';
import { TAB_EVENTS, WINDOW_EVENTS } from 'constants/event-names';

import PermissionDialog from 'main/dialogs/PermissionDialog';
import { VIEW_SOURCE, VALIANT } from 'constants/protocol';
import { PERMISSION_STATE_ALLOW, PERMISSION_STATE_PROMPT } from 'constants/permission-states';
import { getPreload } from 'common';
import logger from 'common/logger';

import AppInstance from './AppInstance';
import contextMenu from '../menus/view';
import { History, operator, Permission } from '../database';

class View {
  constructor(options = { url: 'about:blank', nextTo: null, active: false }) {
    this.opts = Object.assign({}, options);

    this.browserView = new BrowserView({
      webPreferences: {
        preload: getPreload('view'),
        nodeIntegration: false,
        contextIsolation: true,
        plugins: true,
        nativeWindowOpen: true,
        webSecurity: true,
        javascript: true,
        worldSafeExecuteJavaScript: false,
        sandbox: true,
        enableRemoteModule: false,
        partition: this.window.incognito ? 'incognito:view' : 'persist:view',
      },
    });
    this.browserView.setBackgroundColor('#ffffff');
    this.browserView.setAutoResize({ width: true });

    this.webContents.on('page-title-updated', (e, title) => {
      this.title = title;

      this.updateStorage();

      this.updateTitleState();
    });
    this.webContents.on('page-favicon-updated', (e, favicons) => {
      const [favicon] = favicons;
      this.favicon = favicon;

      this.updateStorage();

      this.emit(TAB_EVENTS.UPDATE_FAVICON, favicon);
    });
    this.webContents.on('did-start-loading', () => {
      this.loading = true;

      this.updateNavigationState();

      this.emit(TAB_EVENTS.UPDATE_LOADING, true);
    });
    this.webContents.on('did-stop-loading', () => {
      this.loading = false;

      this.updateNavigationState();

      this.emit(TAB_EVENTS.UPDATE_LOADING, false);
    });
    this.webContents.on('did-start-navigation', (e, ...args) => {
      const [, , isMainFrame] = args;

      if (isMainFrame) {
        this.hidePermissionDialog(true);

        this.instance.hideDialog('suggestion');

        this.updateNavigationState();

        this.favicon = '';

        this.emit(TAB_EVENTS.LOAD_COMMIT, ...args);
        this.updateUrlState(this.webContents.getURL());
      }
    });
    this.webContents.on('did-navigate', async (e, url) => {
      this.instance.hideDialog('suggestion');

      this.addHistory(url);

      this.updateUrlState(url);

      this.updateTitleState();
    });
    this.webContents.on('did-navigate-in-page', (e, url, isMainFrame) => {
      if (isMainFrame) {
        this.instance.hideDialog('suggestion');

        this.addHistory(url, true);

        this.updateUrlState(url);
      }
    });
    this.webContents.on('did-fail-load', async (e, errorCode, errorDescription, validateUrl, isMainFrame) => {
      if (isMainFrame) {
        this.errorUrl = validateUrl;

        this.title = validateUrl;

        this.webContents.loadURL(`${VALIANT}://network-error/${errorCode}`);
      }
    });
    this.webContents.on('media-started-playing', () => {
      this.emit(TAB_EVENTS.MEDIA_IS_PLAYING, true);
    });
    this.webContents.on('media-paused', () => {
      this.emit(TAB_EVENTS.MEDIA_IS_PLAYING, false);
    });
    this.webContents.on('certificate-error', (event, url, error, certificate, callback) => {
      logger.log(url, error, certificate);
      event.preventDefault();
      callback(true);
    });
    this.webContents.on('new-window', (e, url, frameName, disposition) => {
      if (disposition === 'new-window') {
        if (frameName === '_self') {
          e.preventDefault();
          this.webContents.loadURL(url);
        } else if (frameName === '_blank') {
          e.preventDefault();
          const { viewManager } = this.window;

          const index = viewManager.ids.indexOf(viewManager.selected);

          viewManager.create({ url, nextTo: index + 1, active: true });
        }
      } else if (disposition === 'foreground-tab') {
        e.preventDefault();
        const { viewManager } = this.window;

        const index = viewManager.ids.indexOf(viewManager.selected);

        viewManager.create({ url, nextTo: index + 1, active: true });
      } else if (disposition === 'background-tab') {
        e.preventDefault();
        const { viewManager } = this.window;

        const index = viewManager.ids.indexOf(viewManager.selected);

        viewManager.create({ url, nextTo: index + 1 });
      }
    });
    this.webContents.on('context-menu', (e, params) => {
      e.preventDefault();

      const menu = contextMenu(params, this.webContents);
      menu.popup();
    });
    // this.webContents.session.on('will-download', (e, item, webContents) => {
    //   item.
    //   item.on('updated', (e, state) => {

    //   });
    //   item.once('done', (e, state) => {});
    // });
    // preserve approximate location

    const ua = this.webContents.userAgent
      .replace(/ Electron\\?.([^\s]+)/g, '')
      .replace(` ${app.name}/${app.getVersion()}`, '')
      .replace(/ Chrome\\?.([^\s]+)/g, ' Chrome/91.0.4472.77');
    logger.log(ua);
    this.webContents.setUserAgent(ua);
    // this.webContents.on('ipc-message', (e, ...args) => {
    //   logger.log(e.channel, args);
    // });
    // ipcMain.on(this.id, (e, ...args) => {
    //   logger.log(...args);
    // });

    ipcMain.handle(`get-error-url-${this.id}`, () => this.errorUrl);

    ipcMain.handle(`${TAB_EVENTS.MUTE}-${this.id}`, () => this.webContents.setAudioMuted(true));
    ipcMain.handle(`${TAB_EVENTS.UNMUTE}-${this.id}`, () => this.webContents.setAudioMuted(false));

    this.render(this.opts);

    this.webContents.loadURL(this.opts.url);
  }

  get id() {
    return this.webContents.id.toString();
  }

  get webContents() {
    return this.browserView.webContents;
  }

  get instance() {
    return AppInstance.getInstance();
  }

  get window() {
    const { focusedWindow } = this.instance;
    return focusedWindow;
  }

  render(options = { nextTo: null, active: false }) {
    this.webContents.session.setPermissionRequestHandler(this.permissionRequestHandler.bind(this));

    this.instance.hideDialog('suggestion');

    const opts = Object.assign({}, options);

    if (opts.active) {
      this.window.win.addBrowserView(this.browserView);
    }

    this.window.fixBounds();

    if (typeof opts.nextTo === 'number') {
      this.window.emit(WINDOW_EVENTS.TAB_CREATED, {
        id: this.id,
        nextTo: opts.nextTo,
        active: opts.active,
      });
    }

    this.updateTitleState();

    this.updateUrlState(this.lastUrl);

    this.emit(TAB_EVENTS.UPDATE_FAVICON, this.favicon);
  }

  destroy() {
    this.window.win.removeBrowserView(this.browserView);
    this.webContents.destroy();
    this.browserView = null;
  }

  updateNavigationState() {
    if (this.webContents.isDestroyed()) return;

    this.emit(TAB_EVENTS.UPDATE_NAVIGATION_STATE, {
      canGoBack: this.webContents.canGoBack(),
      canGoForward: this.webContents.canGoForward(),
    });
  }

  updateTitleState() {
    let title = this.title || 'Untitled';

    if (this.opts.url?.startsWith?.(VIEW_SOURCE)) {
      title = this.opts.url;
    }

    this.title = title;

    this.emit(TAB_EVENTS.UPDATE_TITLE, this.title);

    this.window.updateTitle();
  }

  updateUrlState(url, options = { isSearchTerm: false, preventUpdateOriginal: false }) {
    const opts = Object.assign({}, options);

    this.lastUrl = url;

    if (this.opts.url.startsWith(VIEW_SOURCE)) {
      this.lastUrl = this.opts.url;
    }

    this.emit(TAB_EVENTS.UPDATE_URL, this.lastUrl, opts);
  }

  emit(event, ...args) {
    this.window.webContents.send(this.id, event, ...args);
  }

  async addHistory(url, inPage) {
    if (this.lastUrl !== url) {
      const history = await operator.insert(History, {
        title: this.title,
        url,
        favicon: this.favicon,
      });

      this.lastHistoryId = history._id;
    } else if (!inPage) {
      this.lastHistoryId = '';
    }
  }

  async updateStorage() {
    if (this.lastHistoryId) {
      const { title, favicon } = this;

      await operator.update(
        History,
        {
          _id: this.lastHistoryId,
        },
        { $set: { title, favicon } },
      );
    }
  }

  async permissionRequestHandler(webContents, permission, callback, details) {
    logger.log(webContents.id, permission, details);

    const webContentsId = webContents.id.toString();

    const url = new URL(details.requestingUrl);

    let permissionName = permission;

    if (permissionName === 'unknown' || (permissionName === 'media' && details.mediaTypes.length === 0)) {
      return callback(false);
    }

    if (permissionName === 'media') {
      if (details.mediaTypes.includes('audio')) {
        permissionName = 'microphone';
      } else if (details.mediaTypes.includes('video')) {
        permissionName = 'camera';
      }
    }

    const data = await operator.findOne(Permission, { hostname: url.hostname, permission: permissionName });

    if (!data) {
      await operator.insert(Permission, {
        hostname: url.hostname,
        permission: permissionName,
        state: PERMISSION_STATE_PROMPT,
      });
    } else if (data.state !== PERMISSION_STATE_PROMPT) {
      return callback(data.state === PERMISSION_STATE_ALLOW);
    }

    const channel = `result-${webContentsId}`;
    ipcMain.removeAllListeners(channel);
    ipcMain.addListener(channel, async (e, result) => {
      this.hidePermissionDialog(true);

      logger.log(url.hostname, permissionName, result);

      await operator.update(
        Permission,
        { hostname: url.hostname, permission: permissionName },
        { $set: { state: result } },
      );

      callback(result === PERMISSION_STATE_ALLOW);
    });

    this.hidePermissionDialog(true);
    this.permissionDialog = new PermissionDialog();

    this.permissionDialog.on(`get-permission`, (e) => {
      e.returnValue = { hostname: url.hostname, name: permission };
    });
    this.permissionDialog.show({ focus: true });
  }

  hidePermissionDialog(force) {
    if (!this.permissionDialog) return;

    this.permissionDialog.hide();

    if (force) {
      this.permissionDialog = undefined;
    }
  }
}

export default View;
