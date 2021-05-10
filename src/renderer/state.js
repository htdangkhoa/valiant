import { useEffect, useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';
import { ipcRenderer } from 'electron';

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
    };

    ipcRenderer.addListener(__DATA__.windowId, listener);
    return () => ipcRenderer.removeListener(__DATA__.windowId, listener);
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

    ipcRenderer.send(__DATA__.windowId, WINDOW_EVENTS.SWITCH_TAB, { id: selectedTab.id });
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

      ipcRenderer.send(__DATA__.windowId, WINDOW_EVENTS.CLOSE_TAB, { id: selectedTab.id });
    }

    if (i === tabs.length - 1) {
      const previous = i - 1;

      if (previous < 0) {
        ipcRenderer.send(__DATA__.windowId, WINDOW_EVENTS.CLOSE);

        return;
      }

      handleTabChange(previous);

      requestCloseTab();

      return;
    }

    requestCloseTab();
  };

  const handleAddNewTab = useCallback(() => {
    ipcRenderer.send(__DATA__.windowId, WINDOW_EVENTS.NEW_TAB);
  }, []);

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

  // new api
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
  };
};

const ToolbarState = createContainer(useToolbarState);

export default ToolbarState;
