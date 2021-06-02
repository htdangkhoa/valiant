import { ipcRenderer } from 'electron';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import Autosuggest from 'react-autosuggest';
import { SuggestionContainer } from './style';
import { DIALOG_EVENTS } from 'constants/event-names';
import { isURL } from 'common';

// const Suggestion = () => {
//   const ref = useRef();

//   const [value, setValue] = useState();

//   return (
//     <SuggestionContainer ref={ref}>
//       <div>Hello world</div>

//       <Select
//         options={options}
//         value={value}
//         onChange={setValue}
//         menuIsOpen
//         menuShouldScrollIntoView={false}
//         // onMenuOpen={async () => {
//         //   const rect = ref.current.getBoundingClientRect();

//         //   console.log(rect);

//         //   const dialogId = await ipcRenderer.sendSync('get-webcontents-id').toString();

//         //   ipcRenderer.send(dialogId, 'ping', 'pong');
//         // }}
//       />
//     </SuggestionContainer>
//   );
// };

const getSuggestionValue = (suggestion) => suggestion.text;

const renderSuggestion = (suggestion) => (
  <div>
    {suggestion.text}
    {suggestion.original && ' - Google Search'}
  </div>
);

const Suggestion = () => {
  const ref = useRef();

  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState(0);

  const onFetch = useCallback(async (q) => {
    let suggestionList = [];

    if (isURL(q)) {
      suggestionList.push({ text: q });
    }

    suggestionList.push({ text: q, searchWithEngine: true });

    const results = await ipcRenderer.invoke('fetch', q);

    suggestionList = suggestionList.concat(...[].concat(results).map((text) => ({ text })));

    setSuggestions(() => suggestionList);
  }, []);

  useEffect(() => {
    ipcRenderer.on('get-address-bar-input-value', async (e, { value }) => {
      setValue(value);

      // setSuggestions(() => []);

      onFetch(value);
    });

    ref.current.focus();
  }, []);

  const hideDialog = useCallback(() => ipcRenderer.send(DIALOG_EVENTS.HIDE_ALL_DIALOG), []);

  return (
    <SuggestionContainer>
      <input
        ref={ref}
        autoFocus
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onInput={(e) => {
          const v = e.currentTarget.value;

          if (v.trim() === '') {
            return setSuggestions(() => []);
          }

          onFetch(v);
        }}
        onKeyPress={async (e) => {
          if (e.key === 'Enter') {
            const viewId = await ipcRenderer.sendSync('get-current-view-id');
            ipcRenderer.invoke('webcontents-call', {
              webContentsId: viewId,
              method: 'loadURL',
              args: 'https://google.com',
            });

            hideDialog();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            hideDialog();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();

            setSelected((his) => {
              const i = his === 0 ? suggestions.length - 1 : his - 1;

              setValue(suggestions[i].text);

              return i;
            });
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();

            setSelected((his) => {
              const i = his === suggestions.length - 1 ? 0 : his + 1;

              setValue(suggestions[i].text);

              return i;
            });
          }

          // setSelected(0);
        }}
      />

      <div>
        {suggestions.map((suggestion, i) => (
          <div key={i} style={{ backgroundColor: selected === i ? 'blue' : 'red' }}>
            <span>{suggestion.text}</span>
            {suggestion.searchWithEngine && <span> - Google Search</span>}
          </div>
        ))}
      </div>
    </SuggestionContainer>
  );
};

export default memo(Suggestion);
