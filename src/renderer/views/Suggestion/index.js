import { ipcRenderer } from 'electron';
import React, { memo, useCallback, useEffect, useState } from 'react';

import { DIALOG_EVENTS } from 'constants/event-names';

import { SuggestionContainer, SuggestionItem } from './style';

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

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);

  const [selected, setSelected] = useState(0);

  useEffect(() => {
    ipcRenderer.on('receive-suggestions', (e, results) => {
      setSuggestions(() => results);
    });
  }, []);

  const hideDialog = useCallback(() => ipcRenderer.send(DIALOG_EVENTS.HIDE_ALL_DIALOG), []);

  return (
    <SuggestionContainer>
      {/* <input
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
      /> */}

      {suggestions.map((suggestion, i) => (
        <SuggestionItem
          key={i}
          onClick={async () => {
            const viewId = await ipcRenderer.sendSync('get-current-view-id');
            ipcRenderer.invoke('webcontents-call', {
              webContentsId: viewId,
              method: 'loadURL',
              args: `https://google.com/search?q=${suggestions[i].text}`,
            });

            hideDialog();
          }}>
          <span>{suggestion.text}</span>
          {suggestion.searchWithEngine && <span> - Google Search</span>}
        </SuggestionItem>
      ))}
    </SuggestionContainer>
  );
};

export default memo(Suggestion);
