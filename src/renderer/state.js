import { useEffect, useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';
import { ipcRenderer } from 'electron';

import { TAB_EVENTS, WINDOW_EVENTS } from 'root/constants/event-names';

const useToolbarState = () => {
  const [windowId, setWindowId] = useState(null);

  useEffect(() => {
    const listener = (e, windowEvent, message) => {
      console.log(windowEvent, message);
      if (windowEvent === WINDOW_EVENTS.CREATED) {
        setWindowId(message);
      }
    };

    ipcRenderer.addListener(WINDOW_EVENTS.RENDERER, listener);
    return () => ipcRenderer.removeListener(WINDOW_EVENTS.RENDERER, listener);
  }, []);

  const [tabs, setTabs] = useState([]);

  const [url, setUrl] = useState('');

  useEffect(() => {
    function listener(e, tabEvent, message) {
      if (tabEvent === 'create-tab') {
        setTabs((his) =>
          [...his]
            .map((tab) => ({ ...tab, active: false }))
            .concat({
              id: message,
              active: true,
              title: 'Untitled',
              favicon: null,
              loading: false,
            }),
        );
      }

      if (tabEvent === TAB_EVENTS.UPDATE_TITLE) {
        const { id, title } = message;

        setTabs((his) =>
          [...his].map((tab) => {
            if (tab.id === id) {
              tab.title = title;
            }

            return tab;
          }),
        );
      }

      if (tabEvent === TAB_EVENTS.UPDATE_FAVICON) {
        const { id, favicon } = message;

        setTabs((his) =>
          [...his].map((tab) => {
            if (tab.id === id) {
              tab.favicon = favicon;
            }

            return tab;
          }),
        );
      }

      if (tabEvent === TAB_EVENTS.UPDATE_LOADING) {
        const { id, loading } = message;

        setTabs((his) =>
          [...his].map((tab) => {
            if (tab.id === id) {
              tab.loading = loading;
            }

            return tab;
          }),
        );
      }

      if (tabEvent === 'did-navigate') {
        console.log(message);
      }
    }

    ipcRenderer.on(TAB_EVENTS.RENDERER, listener);

    return () => ipcRenderer.removeListener(TAB_EVENTS.RENDERER, listener);
  }, []);

  const handleTabChange = (i) => {
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
  };

  const handleCloseTab = (i) => {
    function requestCloseTab() {
      const selectedTab = tabs[i];

      if (!selectedTab) return;

      setTabs((his) =>
        his
          .map((tab) => {
            if (selectedTab.id === tab.id && tab.active) {
              handleTabChange(i + 1);

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

      handleTabChange(previous);

      requestCloseTab();

      return;
    }

    requestCloseTab();
  };

  const handleAddNewTab = useCallback(() => {
    ipcRenderer.send(windowId, WINDOW_EVENTS.NEW_TAB);
  }, [windowId]);

  const handlePreventDoubleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    [tabs],
  );

  const handleUrlChange = useCallback((e) => {
    setUrl(e.target.value);
  }, []);

  return {
    windowId,
    url,
    handleUrlChange,
    tabs,
    setTabs,
    handleTabChange,
    handleCloseTab,
    handleAddNewTab,
    handlePreventDoubleClick,
  };
};

const ToolbarState = createContainer(useToolbarState);

export default ToolbarState;
