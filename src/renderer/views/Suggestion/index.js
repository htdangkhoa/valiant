import { ipcRenderer } from 'electron';
import React, { memo, useCallback, useEffect, useState } from 'react';

import { DIALOG_EVENTS } from 'constants/event-names';

import IconSearch from 'renderer/assets/svg/icon-search.svg';
import { SuggestionContainer, Input, SuggestionItem } from './style';

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);

  const [value, setValue] = useState('');

  const [select, setSelect] = useState(0);

  useEffect(() => {
    ipcRenderer.on('receive-suggestions', (e, results) => {
      setSuggestions(() => results);
    });
  }, []);

  const hideDialog = useCallback(() => ipcRenderer.send(DIALOG_EVENTS.HIDE_ALL_DIALOG), []);

  const onFetch = useCallback(async (q) => {
    // if (q.trim() === '') {
    //   return setSuggestions(() => []);
    // }

    const result = await ipcRenderer.sendSync('fetch2', q);
    console.log('🚀 ~ file: index.js ~ line 67 ~ onInput={ ~ result', result);
    setSuggestions(() => result);
  }, []);

  const onInput = useCallback(async (e) => {
    const v = e.currentTarget.value;

    if (v.trim() === '') {
      return setSuggestions(() => []);
    }

    onFetch(v);
  }, []);

  const onKeyPress = useCallback(async (e) => {
    if (e.key === 'Enter') {
      const viewId = await ipcRenderer.sendSync('get-current-view-id');

      ipcRenderer.invoke('webcontents-call', {
        webContentsId: viewId,
        method: 'loadURL',
        args: 'https://google.com',
      });

      hideDialog();
    }
  }, []);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        hideDialog();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();

        setSelect((his) => {
          const i = his === 0 ? suggestions.length - 1 : his - 1;

          setValue(suggestions[i].text);

          return i;
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();

        setSelect((his) => {
          const i = his === suggestions.length - 1 ? 0 : his + 1;

          setValue(suggestions[i].text);

          return i;
        });
      }
    },
    [suggestions],
  );

  return (
    <SuggestionContainer>
      <Input
        autoFocus
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onInput={onInput}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
      />

      {suggestions.length > 0 &&
        suggestions.map((suggestion, i) => (
          <SuggestionItem
            key={i}
            willSelect={select === i}
            onClick={async () => {
              const viewId = await ipcRenderer.sendSync('get-current-view-id');
              ipcRenderer.invoke('webcontents-call', {
                webContentsId: viewId,
                method: 'loadURL',
                args: `https://google.com/search?q=${suggestions[i].text}`,
              });

              hideDialog();
            }}>
            <div>
              <IconSearch />
            </div>

            <div>
              <span>{suggestion.text}</span>
              {suggestion.searchWithEngine && <span> - Google Search</span>}
            </div>
          </SuggestionItem>
        ))}
    </SuggestionContainer>
  );
};

export default memo(Suggestion);
