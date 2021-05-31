// window events
export const WINDOW_EVENTS = {
  CLOSE: 'CLOSE',

  TAB_CREATED: 'TAB_CREATED',
  NEW_TAB: 'NEW_TAB',
  SWITCH_TAB: 'SWITCH_TAB',
  CLOSE_TAB: 'CLOSE_TAB',
  SWAP_TAB: 'SWAP_TAB',
  MOVE_TAB_TO_NEW_WINDOW: 'MOVE_TAB_TO_NEW_WINDOW',
};

export const TAB_EVENTS = {
  UPDATE_TITLE: 'UPDATE_TITLE',
  UPDATE_FAVICON: 'UPDATE_FAVICON',
  UPDATE_LOADING: 'UPDATE_LOADING',
  UPDATE_URL: 'UPDATE_URL',
  UPDATE_NAVIGATION_STATE: 'UPDATE_NAVIGATION_STATE',
};

export const ADDRESS_BAR_EVENTS = {
  REQUEST_SUGGEST: 'REQUEST_SUGGEST',
};

export const DIALOG_EVENTS = {
  HIDE_DIALOG: 'HIDE_DIALOG',
  HIDE_ALL_DIALOG: 'HIDE_ALL_DIALOG',

  SHOW_SETTINGS_DIALOG: 'SHOW_SETTINGS_DIALOG',
  SHOW_SUGGESTION_DIALOG: 'SHOW_SUGGESTION_DIALOG',
};
