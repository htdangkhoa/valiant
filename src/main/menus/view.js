import { Menu, clipboard } from 'electron';
import { isURL } from 'common';
import AppInstance from '../core/AppInstance';

const contextMenu = (params, webContents) => {
  const { focusedWindow: window, sessions } = AppInstance.getInstance();
  const { viewManager } = window;

  let menuItems = [];

  if (params.linkURL) {
    menuItems = menuItems.concat([
      {
        label: 'Open Link in New Tab',
        click: () => {
          const index = viewManager.ids.indexOf(viewManager.selected);

          viewManager.create({ url: params.linkURL, nextTo: index + 1 });
        },
      },
      { label: 'Open Link in Incognito Window' },
      { type: 'separator' },
      {
        label: 'Copy Link Address',
        click: () => {
          clipboard.clear();
          clipboard.writeText(params.linkURL);
        },
      },
      { type: 'separator' },
    ]);
  }

  if (params.hasImageContents) {
    menuItems = menuItems.concat([
      {
        label: 'Open Image in New Tab',
        click: () => {
          viewManager.create({ url: params.srcURL });
        },
      },
      {
        label: 'Copy Image',
        click: () => {
          webContents.copyImageAt(params.x, params.y);
        },
      },
      {
        label: 'Copy Image Address',
        click: () => {
          clipboard.clear();
          clipboard.writeText(params.srcURL);
        },
      },
      { type: 'separator' },
    ]);
  }

  if (params.isEditable) {
    menuItems = menuItems.concat([
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteAndMatchStyle' },
      { role: 'selectAll' },
      { type: 'separator' },
    ]);
  }

  if (!params.isEditable && params.selectionText) {
    menuItems = menuItems.concat([{ role: 'copy' }]);
  }

  if (params.selectionText) {
    const trimmedText = params.selectionText.trim();

    if (isURL(trimmedText)) {
      menuItems = menuItems.concat([
        {
          label: `Go to '${trimmedText}'`,
          click: () => {
            viewManager.create({ url: trimmedText });
          },
        },
        { type: 'separator' },
      ]);
    }

    menuItems = menuItems.concat([
      {
        label: 'Search with Google',
        click: () => {
          viewManager.create({ url: `https://google.com/search?q=${trimmedText}` });
        },
      },
      { type: 'separator' },
    ]);
  }

  if (['video', 'audio'].includes(params.mediaType)) {
    const type = params.mediaType.charAt(0).toUpperCase() + params.mediaType.slice(1);

    menuItems = menuItems.concat([
      {
        label: `Open ${type} in New Tab`,
        click: () => {
          const index = viewManager.ids.indexOf(viewManager.selected);

          viewManager.create({ url: params.srcURL, nextTo: index + 1 });
        },
      },
      {
        label: `Save ${type} As...`,
        click: () => {
          sessions.view.downloadURL(params.srcURL);
        },
      },
      {
        label: `Copy ${type} Address`,
        click: () => {
          clipboard.clear();
          clipboard.writeText(params.srcURL);
        },
      },
      { type: 'separator' },
    ]);
  }

  if (
    !params.hasImageContents &&
    params.linkURL === '' &&
    params.selectionText === '' &&
    !params.isEditable &&
    params.mediaType === 'none'
  ) {
    menuItems = menuItems.concat([
      {
        label: 'Back',
        enabled: webContents.canGoBack(),
        click: () => {
          webContents.goBack();
        },
      },
      {
        label: 'Forward',
        enabled: webContents.canGoForward(),
        click: () => {
          webContents.goForward();
        },
      },
      {
        label: 'Reload',
        click: () => {
          webContents.reload();
        },
      },
      { type: 'separator' },
      { label: 'Save As...' },
      { label: 'Print...' },
      { type: 'separator' },
      {
        label: 'View Page Source',
        click: () => {
          const index = viewManager.ids.indexOf(viewManager.selected);

          viewManager.create({
            url: `view-source:${viewManager.selectedView.webContents.getURL()}`,
            nextTo: index + 1,
            active: true,
          });
        },
      },
      { type: 'separator' },
    ]);
  }

  menuItems = menuItems.concat([
    {
      label: 'Inspect Element',
      click: () => webContents.inspectElement(params.x, params.y),
    },
  ]);

  return Menu.buildFromTemplate(menuItems);
};

export default contextMenu;
