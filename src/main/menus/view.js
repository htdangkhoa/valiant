import { Menu, clipboard, MenuItem, ContextMenuParams, WebContents } from 'electron';
import { isURL } from 'root/common';
import AppInstance from '../AppInstance';

const contextMenu = (params, webContents) => {
  const { viewManager } = AppInstance.getInstance().focusedWindow;

  let menuItems = [];

  if (params.linkURL) {
    menuItems = menuItems.concat([
      {
        label: 'Open Link in New Tab',
        click: () => viewManager.create({ url: params.linkURL }),
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

  if (!params.hasImageContents && params.linkURL === '' && params.selectionText === '' && !params.isEditable) {
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
      { label: 'View Page Source' },
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