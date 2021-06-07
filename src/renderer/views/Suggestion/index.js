import { ipcRenderer } from 'electron';
import React, { memo, useEffect, useState } from 'react';

import { ADDRESS_BAR_EVENTS, DIALOG_EVENTS } from 'constants/event-names';

import IconSearch from 'renderer/assets/svg/icon-search.svg';
import { SuggestionContainer, SuggestionItem } from './style';

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);

  const [select, setSelect] = useState(0);

  useEffect(() => {
    const listener = () => {
      ipcRenderer.send(DIALOG_EVENTS.HIDE_ALL_DIALOG);
    };
    window.addEventListener('blur', listener);
    return () => window.removeEventListener('blur', listener);
  }, []);

  useEffect(() => {
    const listener = async (e, v) => {
      const result = await ipcRenderer.sendSync('fetch2', v);

      setSuggestions(() => result);
    };

    ipcRenderer.addListener(ADDRESS_BAR_EVENTS.INITIAL_VALUE, listener);
    return () => ipcRenderer.removeListener(ADDRESS_BAR_EVENTS.INITIAL_VALUE, listener);
  }, []);

  useEffect(() => {
    setSelect(0);

    if (!suggestions.length) {
      return;
    }

    const listener = (e, key) => {
      if (key === 'ArrowUp') {
        setSelect((his) => {
          const i = his === 0 ? suggestions.length - 1 : his - 1;

          ipcRenderer.send(window.windowId, 'update-address-bar', suggestions[i]);

          return i;
        });

        return;
      }

      if (key === 'ArrowDown') {
        setSelect((his) => {
          const i = his === suggestions.length - 1 ? 0 : his + 1;

          ipcRenderer.send(window.windowId, 'update-address-bar', suggestions[i]);

          return i;
        });
      }
    };

    ipcRenderer.addListener('suggestion:forwarding-keydown', listener);
    return () => ipcRenderer.removeListener('suggestion:forwarding-keydown', listener);
  }, [suggestions]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <SuggestionContainer>
      {suggestions.map((suggestion, i) => (
        <SuggestionItem key={i} willSelect={select === i}>
          <div>
            <IconSearch />
          </div>

          <div>
            <span>{suggestion.text}</span>
            {suggestion.label && <span>{suggestion.label}</span>}
          </div>
        </SuggestionItem>
      ))}
    </SuggestionContainer>
  );
};

export default memo(Suggestion);
