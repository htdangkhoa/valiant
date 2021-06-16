import { app, Menu } from 'electron';

const appMenu = (instance) => {
  const { showDialog } = instance;

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'File',
      submenu: [
        { label: 'New Window', accelerator: 'CmdOrCtrl+N' },
        { label: 'New Incognito Window', accelerator: 'CmdOrCtrl+Shift+N' },
        { label: 'New Tab', accelerator: 'CmdOrCtrl+T' },
        { type: 'separator' },
        { label: 'Close Window', accelerator: 'CmdOrCtrl+Shift+W' },
        { label: 'Close Tab', accelerator: 'CmdOrCtrl+W' },
        { label: 'Save Page As...', accelerator: 'CmdOrCtrl+P' },
        { type: 'separator' },
        { label: 'Print', accelerator: 'CmdOrCtrl+P' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Find...',
          accelerator: 'CmdOrCtrl+F',
          click: () => showDialog.apply(instance, ['find', { focus: true }]),
        },
        {
          label: 'Speech',
          submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload This Page' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+O' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-' },
        { type: 'separator' },
        {
          label: 'Developer',
          submenu: [
            { label: 'View Source', accelerator: 'CmdOrCtrl+Alt+U' },
            { label: 'Developer Tools', accelerator: 'CmdOrCtrl+Alt+I' },
          ],
        },
      ],
    },
    {
      label: 'History',
      submenu: [],
    },
    {
      label: 'Bookmarks',
      submenu: [],
    },
    {
      label: 'Tab',
      submenu: [],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { label: 'Downloads' },
        { type: 'separator' },
        { role: 'front' },
      ],
    },
  ]);

  return Menu.setApplicationMenu(menu);
};

export default appMenu;
