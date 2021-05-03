import { useEffect, useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';
import { ipcRenderer } from 'electron';

import { FETCH_BROWSER_VIEWS } from 'root/constants/event-names';

const useToolbarState = () => {
  const [tabs, setTabs] = useState([]);

  const [url, setUrl] = useState('');

  useEffect(() => {
    function listener(e, message) {
      setTabs(() => [].concat(message));
    }

    ipcRenderer.addListener(FETCH_BROWSER_VIEWS, listener);

    return () => ipcRenderer.removeListener(FETCH_BROWSER_VIEWS, listener);
  }, []);

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
