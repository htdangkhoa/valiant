import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ipcRenderer } from 'electron';

import IconClose from 'renderer/assets/svg/icon-close.svg';
import IconChevronUp from 'renderer/assets/svg/icon-chevron-up.svg';
import IconChevronDown from 'renderer/assets/svg/icon-chevron-down.svg';
import { ButtonIcon } from 'renderer/components/Button';
import { callWebContentsMethod } from 'renderer/utils/view';

import { DialogContainer, Input, Label, Separator } from './style';

const getViewId = () => ipcRenderer.sendSync('get-current-view-id');

const Find = () => {
  const inputRef = useRef();

  const [value, setValue] = useState('');

  const [findInfo, setFindInfo] = useState({
    activeMatchOrdinal: 0,
    finalUpdate: false,
    matches: 0,
  });

  const onMove = useCallback(
    (forward) => () => {
      const viewId = getViewId();

      callWebContentsMethod(viewId, 'findInPage', value, {
        forward,
        findNext: false,
      });
    },
    [value],
  );

  const onInput = useCallback((e) => {
    const { value: v } = e.currentTarget;

    const viewId = getViewId();

    const dialogId = ipcRenderer.sendSync('get-webcontents-id');

    if (!v) {
      callWebContentsMethod(viewId, 'stopFindInPage', 'clearSelection');
    } else {
      callWebContentsMethod(viewId, 'findInPage', v);
    }

    ipcRenderer.send(`${dialogId}-update-last-value`, v);
  }, []);

  const onKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        onMove(true)();
      }
    },
    [onMove],
  );

  const onClose = useCallback(() => {
    const viewId = getViewId();

    callWebContentsMethod(viewId, 'stopFindInPage', 'keepSelection');

    const dialogId = ipcRenderer.sendSync('get-webcontents-id');
    ipcRenderer.send(`${dialogId}-hide`);
  }, []);

  useEffect(() => {
    const listener = (e, result) => {
      setFindInfo(result);
    };

    ipcRenderer.on('found-in-page', listener);
    return () => ipcRenderer.removeListener('found-in-page', listener);
  }, []);

  useEffect(() => {
    const listener = () => {
      inputRef.current.select();
    };

    ipcRenderer.on('focus', listener);
    return () => ipcRenderer.removeListener('focus', listener);
  }, []);

  return (
    <DialogContainer>
      <Input
        ref={inputRef}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onInput={onInput}
        onKeyPress={onKeyPress}
      />

      {!!value && (
        <Label>
          {findInfo.activeMatchOrdinal}/{findInfo.matches}
        </Label>
      )}

      <Separator />

      <ButtonIcon src={IconChevronUp} onClick={onMove(false)} />

      <ButtonIcon src={IconChevronDown} onClick={onMove(true)} />

      <ButtonIcon src={IconClose} srcSize={16} onClick={onClose} />
    </DialogContainer>
  );
};

export default memo(Find);
