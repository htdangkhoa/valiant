import { useEffect, useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';
import { ipcRenderer } from 'electron';

import { FETCH_BROWSER_VIEWS, TAB_EVENTS, UPDATE_TITLE } from 'root/constants/event-names';

const useToolbarState = () => {
  const [tabs, setTabs] = useState([]);

  const [url, setUrl] = useState('');

  useEffect(() => {
    function listener(e, tabEvent, message) {
      let $tabs = [];

      if (tabEvent === FETCH_BROWSER_VIEWS) {
        $tabs = [].concat(message);
      }

      if (tabEvent === UPDATE_TITLE) {
        const { id, title } = message;

        $tabs = $tabs.map((tab) => {
          if (tab.id === id) {
            tab.title = title;
          }

          return tab;
        });
      }

      console.log('_____', $tabs);

      setTabs(() => $tabs);
    }

    ipcRenderer.addListener(TAB_EVENTS, listener);

    return () => ipcRenderer.removeListener(TAB_EVENTS, listener);
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
