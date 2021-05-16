import React, { memo, useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';

import IconBack from 'root/renderer/assets/svg/icon-back.svg';
import IconForward from 'root/renderer/assets/svg/icon-forward.svg';
import IconRefresh from 'root/renderer/assets/svg/icon-refresh.svg';
import IconClose from 'root/renderer/assets/svg/icon-close.svg';
import IconLock from 'root/renderer/assets/svg/icon-lock.svg';
import IconStar from 'root/renderer/assets/svg/icon-start.svg';
import IconMenu from 'root/renderer/assets/svg/icon-menu.svg';

import { InputContainer, Input, Text } from './style';

import './style.scss';
import AddressBarState from './state';
import TabBarState from '../TabBar/state';
import { classnames } from 'root/renderer/utils';

const AddressBard = () => {
  // const { windowId } = TabBarState.useContainer();
  const { activeTab, isSearchBarFocused, handleSearchBarFocusChange, url, handleUrlChange, urlSegments } =
    AddressBarState.useContainer();

  // useEffect(() => {
  //   const listener = (e, event, message) => {
  //     console.log('address bar', event, message);
  //   };

  //   ipcRenderer.on(windowId, listener);
  //   return () => ipcRenderer.removeListener(windowId, listener);
  // }, []);

  const onFocus = useCallback((e) => {
    handleSearchBarFocusChange(true)();

    e.target.select();
  }, []);

  const onBlur = useCallback((e) => {
    e.currentTarget.blur();
    window.getSelection().removeAllRanges();

    handleSearchBarFocusChange(false)();
  }, []);

  return (
    <div className='address-bar flex items-center'>
      <div className={classnames('btn w-24 h-24', !activeTab?.canGoBack && 'disable')}>
        <IconBack fill='#ffffff' />
      </div>

      <div className={classnames('btn w-24 h-24', !activeTab?.canGoForward && 'disable')}>
        <IconForward fill='#ffffff' />
      </div>

      <div className={classnames('btn w-24 h-24', !!activeTab?.loading && 'p-0')}>
        {!activeTab?.loading && <IconRefresh fill='#ffffff' />}

        {!!activeTab?.loading && <IconClose fill='#ffffff' />}
      </div>

      <div className='search-field flex'>
        <div className='btn w-24 h-24'>
          <IconLock fill='#88cc88' />
        </div>

        <InputContainer>
          <Input
            visible={isSearchBarFocused}
            value={url}
            onChange={handleUrlChange}
            onFocus={onFocus}
            onBlur={onBlur}
            spellCheck={false}
          />

          <Text visible={!isSearchBarFocused}>
            {urlSegments.protocol && <div style={{ opacity: 0.5 }}>{`${urlSegments.protocol}//`}</div>}
            <div>{urlSegments.hostname}</div>
            {urlSegments.pathname && <div style={{ opacity: 0.5 }}>{urlSegments.pathname}</div>}
          </Text>
        </InputContainer>

        <div className='btn w-24 h-24'>
          <IconStar fill='#ffffff' />
        </div>
      </div>

      <div className='btn w-24 h-24'>
        <IconMenu fill='#ffffff' />
      </div>
    </div>
  );
};

export default memo(AddressBard);
