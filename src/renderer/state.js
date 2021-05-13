import { useEffect, useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';
import { ipcRenderer } from 'electron';
import * as remote from '@electron/remote';

import { WINDOW_EVENTS } from 'root/constants/event-names';

const useToolbarState = () => {
  // eslint-disable-next-line no-underscore-dangle
  const __DATA__ = window.process.argv.reduce((obj, s) => {
    const [key, value] = s.split('=');

    obj[key] = value;

    return obj;
  }, {});

  const [tabs, setTabs] = useState([]);

  const [url, setUrl] = useState('');

  useEffect(() => {
    const listener = (e, eventName, message) => {
      console.log(eventName, message);

      // window events
      if (eventName === WINDOW_EVENTS.TAB_CREATED) {
        const { id, nextTo } = message;

        if (typeof nextTo === 'number') {
          setTabs((his) => {
            const arr = [...his].map((tab) => ({ ...tab, active: false }));
            arr.splice(nextTo, 0, { id, active: true, title: 'Untitled', favicon: null, loading: false });

            return arr;
          });
        } else {
          setTabs((his) =>
            [...his]
              .map((tab) => ({ ...tab, active: false }))
              .concat({
                id,
                active: true,
                title: 'Untitled',
                favicon: null,
                loading: false,
              }),
          );
        }
      }

      if (eventName === WINDOW_EVENTS.NEW_TAB_TO_THE_RIGHT) {
        const { id, nextIndex } = message;
        setTabs((his) => {
          const a = [...his].map((tab) => ({ ...tab, active: false }));
          a.splice(nextIndex, 0, { id, active: true, title: 'Untitled', favicon: null, loading: false });

          return a;
        });
      }
    };

    ipcRenderer.addListener(__DATA__.windowId, listener);
    return () => ipcRenderer.removeListener(__DATA__.windowId, listener);
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

      ipcRenderer.send(__DATA__.windowId, WINDOW_EVENTS.SWITCH_TAB, { id: selectedTab.id });
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

        ipcRenderer.send(__DATA__.windowId, WINDOW_EVENTS.CLOSE_TAB, { id: selectedTab.id });
      }

      if (i === tabs.length - 1) {
        const previous = i - 1;

        if (previous < 0) {
          ipcRenderer.send(__DATA__.windowId, WINDOW_EVENTS.CLOSE);

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
    (nextTo) => {
      const args = [__DATA__.windowId, WINDOW_EVENTS.NEW_TAB];

      if (typeof nextTo === 'number') {
        args.push(nextTo);
      }

      ipcRenderer.send(...args);
    },
    [tabs],
  );

  const handlePreventDoubleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleUrlChange = useCallback((e) => {
    setUrl(e.target.value);
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

  const onContextMenu = useCallback(
    (index) => () => {
      const tab = tabs[index];

      const menu = remote.Menu.buildFromTemplate([
        {
          label: 'New Tab',
          click: () => handleAddNewTab(index + 1),
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
        {
          label: 'Close Other Tabs',
        },
      ]);

      menu.popup();
    },
    [handleAddNewTab],
  );

  return {
    url,
    handleUrlChange,
    tabs,
    setTabs,
    handleTabChange,
    handleCloseTab,
    handleAddNewTab,
    handlePreventDoubleClick,
    handleTitleChange,
    handleFaviconChange,
    handleLoadingChange,
    onContextMenu,
  };
};

const ToolbarState = createContainer(useToolbarState);

export default ToolbarState;
