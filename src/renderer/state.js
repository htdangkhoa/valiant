import { useEffect, useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';
import { ipcRenderer } from 'electron';

import {
  FETCH_BROWSER_VIEWS,
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
      console.log('🚀 ~ file: state.js ~ line 14 ~ listener ~ tabEvent, message', tabEvent, message);

      if (tabEvent === 'create-tab') {
        console.log('1');

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

      // console.log('_____', $tabs);

      // setTabs(() => $tabs);
    }

    ipcRenderer.on(TAB_EVENTS, listener);

    // return () => ipcRenderer.removeListener(TAB_EVENTS, listener);
  }, []);

  // useEffect(() => {
  //   if (tabs.length !== 0) {
  //     const listener = (e, message) => {
  //       const { id, title } = message;

  //       console.log(tabs.find((tab) => tab.id === id));

  //       // setTimeout(() => {
  //       document.querySelector(`[id='${id}'] p`).setAttribute('title', title);
  //       document.querySelector(`[id='${id}'] p`).innerHTML = title;
  //       // }, 0);
  //     };

  //     ipcRenderer.addListener(UPDATE_TITLE, listener);

  //     return () => ipcRenderer.removeListener(UPDATE_TITLE, listener);
  //   }
  // }, [tabs]);

  const handleUrlChange = useCallback((e) => {
    setUrl(e.target.value);
  }, []);

  return {
    url,
    handleUrlChange,
    tabs,
  };
};

const ToolbarState = createContainer(useToolbarState);

export default ToolbarState;
