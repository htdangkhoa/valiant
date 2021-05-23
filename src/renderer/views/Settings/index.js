import React from 'react';
import { ipcRenderer } from 'electron';
import { DIALOG_EVENTS } from 'constants/event-names';
import { MenuItems, MenuItem } from './style';

window.addEventListener('blur', () => {
  ipcRenderer.send(DIALOG_EVENTS.HIDE_DIALOG, window.__DATA__.dialogId);
});

const Settings = () => (
  <MenuItems>
    <MenuItem onClick={() => window.blur()}>New Tab</MenuItem>
    <MenuItem>New Window</MenuItem>
    <MenuItem>New Incognito Window</MenuItem>
    <MenuItem separator />
    <MenuItem>History</MenuItem>
    <MenuItem>Bookmarks</MenuItem>
    <MenuItem>Downloads</MenuItem>
    <MenuItem separator />
    <MenuItem>Zoom</MenuItem>
    <MenuItem>Print...</MenuItem>
    <MenuItem>Find...</MenuItem>
    <MenuItem separator />
    <MenuItem>Settings</MenuItem>
    <MenuItem>Help</MenuItem>
  </MenuItems>
);

export default Settings;
