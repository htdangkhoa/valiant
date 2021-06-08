import { useEffect, useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';
import { ipcRenderer } from 'electron';
import * as remote from '@electron/remote';

import { ADDRESS_BAR_EVENTS, TAB_EVENTS, WINDOW_EVENTS } from 'constants/event-names';
import { first } from 'common';
import logger from 'common/logger';
import { getCurrentWindow } from 'renderer/utils/window';
import { callWebContentsMethod } from 'renderer/utils/view';

const useTabBarState = () => {
  const windowId = getCurrentWindow().id.toString();

  const [tabs, setTabs] = useState([]);

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

          const tab = {
            id,
            active,
            title: 'Untitled',
            favicon: null,
            loading: false,
            canGoBack: false,
            canGoForward: false,
            mediaIsPlaying: false,
            isMuted: false,
            blockedAds: 0,
            url: {
              original: '',
              text: '',
              isSearchTerm: false,
            },
          };

          if (typeof nextTo === 'number') {
            arr.splice(nextTo, 0, tab);
          } else {
            arr = arr.concat(tab);
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
    (i, isMove) => (e) => {
      if (e) {
        e.stopPropagation();
      }

      function requestCloseTab(hook) {
        const selectedTab = tabs[i];

        logger.log('selectedTab', selectedTab);

        if (!selectedTab) return;

        setTabs((his) =>
          [...his]
            .map((tab) => {
              if (selectedTab.id === tab.id && tab.active) {
                if (typeof hook === 'function') {
                  hook();
                }

                if (!isMove) {
                  ipcRenderer.send(windowId, WINDOW_EVENTS.CLOSE_TAB, { id: tab.id });
                }

                return tab;
              }

              return tab;
            })
            .filter((tab) => tab.id !== selectedTab.id),
        );
      }

      if (i === tabs.length - 1) {
        const previous = i - 1;

        if (previous < 0) {
          ipcRenderer.send(windowId, WINDOW_EVENTS.CLOSE);

          return;
        }

        handleTabChange(previous)();
      }

      handleTabChange(i + 1)();

      // handle tab animation
      const tabElement = document.getElementById(`tab-${i}`);
      const rect = tabElement.getBoundingClientRect();

      const style = document.createElement('style');
      style.id = `tab-style-${i}`;
      style.textContent = `
        @keyframes slide-out {
          0% {
            left: 0;
            opacity: 1;
          }
          100% {
            left: ${rect.width * -1}px;
            opacity: 0;
          }
        }
      `;

      document.head.appendChild(style);

      tabElement.style.animation = 'slide-out 0.2s';

      function animationEndListener() {
        document.getElementById(`tab-style-${i}`).remove();

        requestCloseTab(() => {
          tabElement.removeEventListener('animationend', this);
          tabElement.removeEventListener('webkitAnimationEnd', this);
        });
      }

      tabElement.addEventListener('animationend', animationEndListener);
      tabElement.addEventListener('webkitAnimationEnd', animationEndListener);
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
  const handleLoadCommit = useCallback((id) => {
    setTabs((his) =>
      [...his].map(($tab) => {
        if ($tab.id === id) {
          $tab.blockedAds = 0;
        }
        return $tab;
      }),
    );
  }, []);

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

  const handleNavigationStateChange = useCallback((id, navigationState) => {
    setTabs((his) =>
      [...his].map((tab) => {
        if (tab.id === id) {
          tab.canGoBack = navigationState.canGoBack;
          tab.canGoForward = navigationState.canGoForward;
        }
        return tab;
      }),
    );
  }, []);

  const handleUrlChange = useCallback((id, url, options = { isSearchTerm: false, preventUpdateOriginal: false }) => {
    const opts = Object.assign({}, options);

    setTabs((his) =>
      [...his].map((tab) => {
        if (tab.id === id) {
          tab.url = Object.assign({}, tab.url, {
            text: url,
            original: opts.preventUpdateOriginal ? tab.url.original : url,
            isSearchTerm: opts.isSearchTerm,
          });
        }
        return tab;
      }),
    );
  }, []);

  const handleMediaIsPlayingChange = useCallback((id, isPlaying) => {
    setTabs((his) =>
      [...his].map(($tab) => {
        if ($tab.id === id) {
          $tab.mediaIsPlaying = isPlaying;
        }
        return $tab;
      }),
    );
  }, []);

  const handleMuteChange = useCallback(
    (id) => () => {
      ipcRenderer.invoke(`${TAB_EVENTS.MUTE}-${id}`);

      setTabs((his) =>
        [...his].map(($tab) => {
          if ($tab.id === id) {
            $tab.isMuted = true;
          }
          return $tab;
        }),
      );
    },
    [],
  );

  const handleUnmuteChange = useCallback(
    (id) => () => {
      ipcRenderer.invoke(`${TAB_EVENTS.UNMUTE}-${id}`);

      setTabs((his) =>
        [...his].map(($tab) => {
          if ($tab.id === id) {
            $tab.isMuted = false;
          }
          return $tab;
        }),
      );
    },
    [],
  );

  const handleAdsCounting = useCallback((id) => {
    setTabs((his) =>
      [...his].map(($tab) => {
        if ($tab.id === id) {
          $tab.blockedAds += 1;
        }
        return $tab;
      }),
    );
  }, []);

  const onGoBack = useCallback((id) => () => callWebContentsMethod(id, 'goBack'), []);
  const onGoForward = useCallback((id) => () => callWebContentsMethod(id, 'goForward'), []);
  const onReload = useCallback((id) => () => callWebContentsMethod(id, 'reload'), []);
  const onStop = useCallback((id) => () => callWebContentsMethod(id, 'stop'), []);
  const onLoadURL = useCallback((id, url) => () => callWebContentsMethod(id, 'loadURL', url), []);

  // address bar handler
  const onFetchSuggest = useCallback(
    async ({ value }) => {
      const tab = first(tabs.filter((t) => !!t.active));

      if (!tab) return;

      ipcRenderer.send(`${ADDRESS_BAR_EVENTS.REQUEST_SUGGEST}-${windowId}`, value);
    },
    [tabs],
  );

  const onContextMenu = useCallback(
    (index) => () => {
      const tab = tabs[index];

      const menu = remote.Menu.buildFromTemplate([
        {
          label: 'New Tab',
          click: handleAddNewTab({ nextTo: index + 1 }),
        },
        {
          label: 'Move Tab to New Window',
          enabled: tabs.length > 1,
          click: () => {
            handleCloseTab(index, true)();

            ipcRenderer.send(windowId, WINDOW_EVENTS.MOVE_TAB_TO_NEW_WINDOW, tab.id);
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Reload',
          click: onReload(tab.id),
        },
        {
          label: 'Duplicate',
        },
        {
          label: 'Pin',
        },
        {
          label: tab.isMuted ? 'Unmute Site' : 'Mute Site',
          click: tab.isMuted ? handleUnmuteChange(tab.id) : handleMuteChange(tab.id),
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
    [handleAddNewTab, handleMuteChange, handleUnmuteChange],
  );

  return {
    windowId,
    tabs,
    setTabs,
    handleTabChange,
    handleCloseTab,
    handleAddNewTab,
    handlePreventDoubleClick,
    handleDragEnd,
    handleLoadCommit,
    handleTitleChange,
    handleFaviconChange,
    handleLoadingChange,
    handleNavigationStateChange,
    handleUrlChange,
    handleMediaIsPlayingChange,
    handleMuteChange,
    handleUnmuteChange,
    handleAdsCounting,
    onGoBack,
    onGoForward,
    onReload,
    onStop,
    onLoadURL,
    onFetchSuggest,
    onContextMenu,
  };
};

const TabBarState = createContainer(useTabBarState);

export default TabBarState;
