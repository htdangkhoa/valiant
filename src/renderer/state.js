import { useEffect, useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';
import { ipcRenderer } from 'electron';

import {
  CLOSE_TAB,
  CLOSE_WINDOW,
  NEW_TAB,
  SWITCH_TAB,
  TAB_EVENTS,
  UPDATE_FAVICON,
  UPDATE_LOADING,
  UPDATE_TITLE,
} from 'root/constants/event-names';

const useToolbarState = () => {
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

      if (tabEvent === UPDATE_TITLE) {
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

      if (tabEvent === UPDATE_FAVICON) {
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

      if (tabEvent === UPDATE_LOADING) {
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

    ipcRenderer.on(TAB_EVENTS, listener);

    return () => ipcRenderer.removeListener(TAB_EVENTS, listener);
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

    ipcRenderer.send(SWITCH_TAB, { id: selectedTab.id });
  };

  const handleCloseTab = (i) => {
    function requestCloseTab() {
      const selectedTab = tabs[i];

      if (!selectedTab) return;

      setTabs((his) => [...his].filter((tab) => tab.id !== selectedTab.id));

      ipcRenderer.send(CLOSE_TAB, { id: selectedTab.id });
    }

    if (i === tabs.length - 1) {
      const previous = i - 1;

      if (previous < 0) {
        ipcRenderer.send(CLOSE_WINDOW);

        return;
      }

      handleTabChange(previous);

      requestCloseTab();

      return;
    }

    requestCloseTab();
  };

  const handleAddNewTab = useCallback(() => {
    ipcRenderer.send(NEW_TAB);
  }, []);

  const handleUrlChange = useCallback((e) => {
    setUrl(e.target.value);
  }, []);

  return {
    url,
    handleUrlChange,
    tabs,
    handleTabChange,
    handleCloseTab,
    handleAddNewTab,
  };
};

const ToolbarState = createContainer(useToolbarState);

export default ToolbarState;
