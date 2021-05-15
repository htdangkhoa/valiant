import { useEffect, useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';
import { ipcRenderer } from 'electron';
import * as remote from '@electron/remote';

import { ADDRESS_BAR_EVENTS, WINDOW_EVENTS } from 'root/constants/event-names';
import { first } from 'root/common';

const useTabBarState = () => {
  // eslint-disable-next-line no-underscore-dangle
  const __DATA__ = window.process.argv.reduce((obj, s) => {
    const [key, value] = s.split('=');

    obj[key] = value;

    return obj;
  }, {});

  const { windowId } = __DATA__;

  const [tabs, setTabs] = useState([]);

  const [url, setUrl] = useState('');

  useEffect(() => {
    const listener = (e, eventName, message) => {
      console.log(eventName, message);

      // window events
      if (eventName === WINDOW_EVENTS.TAB_CREATED) {
        const { id, nextTo, active } = message;

        setTabs((his) => {
          let arr = [...his];
          if (active) {
            arr = arr.map((tab) => ({ ...tab, active: false }));
          }

          if (typeof nextTo === 'number') {
            arr.splice(nextTo, 0, { id, active, title: 'Untitled', favicon: null, loading: false });
          } else {
            arr = arr.concat({
              id,
              active,
              title: 'Untitled',
              favicon: null,
              loading: false,
            });
          }

          return arr;
        });
      }
    };

    ipcRenderer.addListener(windowId, listener);
    return () => ipcRenderer.removeListener(windowId, listener);
  }, []);

  const handleTabChange = useCallback(
    (i) => () => {
      const selectedTab = tabs[i];

      if (!selectedTab) return;

      setTabs((his) =>
        [...his].map((tab) => {
          tab.active = false;

          if (tab.id === selectedTab.id) {
            tab.active = true;
          }

          return tab;
        }),
      );

      ipcRenderer.send(windowId, WINDOW_EVENTS.SWITCH_TAB, { id: selectedTab.id });
    },
    [tabs],
  );

  const handleCloseTab = useCallback(
    (i) => (e) => {
      if (e) {
        e.stopPropagation();
      }

      function requestCloseTab() {
        const selectedTab = tabs[i];

        if (!selectedTab) return;

        setTabs((his) =>
          his
            .map((tab) => {
              if (selectedTab.id === tab.id && tab.active) {
                handleTabChange(i + 1)();

                return tab;
              }

              return tab;
            })
            .filter((tab) => tab.id !== selectedTab.id),
        );

        ipcRenderer.send(windowId, WINDOW_EVENTS.CLOSE_TAB, { id: selectedTab.id });
      }

      if (i === tabs.length - 1) {
        const previous = i - 1;

        if (previous < 0) {
          ipcRenderer.send(windowId, WINDOW_EVENTS.CLOSE);

          return;
        }

        handleTabChange(previous)();

        requestCloseTab();

        return;
      }

      requestCloseTab();
    },
    [tabs],
  );

  const handleAddNewTab = useCallback(
    (options = { nextTo: null, active: false }) =>
      () => {
        const opts = Object.assign({}, options);

        const args = [windowId, WINDOW_EVENTS.NEW_TAB, opts];

        ipcRenderer.send(...args);
      },
    [tabs],
  );

  const handlePreventDoubleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnd = useCallback((from, to) => {
    console.log('🚀 ~ file: state.js ~ line 150 ~ handleDragEnd ~ from, to', from, to);
    ipcRenderer.send(windowId, WINDOW_EVENTS.SWAP_TAB, { from, to });
  }, []);

  // browser view handler
  const handleTitleChange = useCallback((id, title) => {
    setTabs((his) =>
      [...his].map(($tab) => {
        if ($tab.id === id) {
          $tab.title = title;
        }
        return $tab;
      }),
    );
  }, []);

  const handleFaviconChange = useCallback((id, favicon) => {
    setTabs((his) =>
      [...his].map((tab) => {
        if (tab.id === id) {
          tab.favicon = favicon;
        }
        return tab;
      }),
    );
  }, []);

  const handleLoadingChange = useCallback((id, loading) => {
    setTabs((his) =>
      [...his].map((tab) => {
        if (tab.id === id) {
          tab.loading = loading;
        }
        return tab;
      }),
    );
  }, []);

  // address bar handler
  const onFetchSuggest = useCallback(
    async ({ value }) => {
      const tab = first(tabs.filter((t) => !!t.active));

      if (!tab) return;

      ipcRenderer.send(`${ADDRESS_BAR_EVENTS.REQUEST_SUGGEST}-${windowId}`, value);
    },
    [tabs],
  );

  const handleUrlChange = useCallback((e) => {
    setUrl(e.target.value);
  }, []);

  const onContextMenu = useCallback(
    (index) => () => {
      const tab = tabs[index];

      const menu = remote.Menu.buildFromTemplate([
        {
          label: 'New Tab',
          click: () => handleAddNewTab({ nextTo: index + 1 })(),
        },
        {
          label: 'Move Tab to New Window',
        },
        {
          type: 'separator',
        },
        {
          label: 'Reload',
        },
        {
          label: 'Duplicate',
        },
        {
          label: 'Pin',
        },
        {
          label: 'Mute Site',
        },
        {
          type: 'separator',
        },
        {
          label: 'Close',
          click: () => handleCloseTab(index)(),
        },
        // {
        //   label: 'Close Other Tabs',
        //   enabled: tabs.length > 1,
        // },
      ]);

      menu.popup();
    },
    [handleAddNewTab],
  );

  return {
    windowId,
    url,
    tabs,
    setTabs,
    handleTabChange,
    handleCloseTab,
    handleAddNewTab,
    handlePreventDoubleClick,
    handleDragEnd,
    handleTitleChange,
    handleFaviconChange,
    handleLoadingChange,
    handleUrlChange,
    onFetchSuggest,
    onContextMenu,
  };
};

const TabBarState = createContainer(useTabBarState);

export default TabBarState;
