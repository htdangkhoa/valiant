import React, { memo } from 'react';
import { MenuItems, MenuItem } from './style';

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

export default memo(Settings);
