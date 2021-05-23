import React from 'react';
import { ipcRenderer } from 'electron';
import { DIALOG_EVENTS } from 'constants/event-names';

window.addEventListener('blur', () => {
  ipcRenderer.send(DIALOG_EVENTS.HIDE_DIALOG, window.__DATA__.dialogId);
});

const Settings = () => <div>Settings</div>;

export default Settings;
