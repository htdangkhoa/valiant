import React, { memo, useCallback } from 'react';
import { ipcRenderer } from 'electron';

import IconBack from 'renderer/assets/svg/icon-back.svg';
import IconForward from 'renderer/assets/svg/icon-forward.svg';
import IconRefresh from 'renderer/assets/svg/icon-refresh.svg';
import IconClose from 'renderer/assets/svg/icon-close.svg';
import IconHome from 'renderer/assets/svg/icon-home.svg';
import IconLock from 'renderer/assets/svg/icon-lock.svg';
import IconStar from 'renderer/assets/svg/icon-star.svg';
import IconDownload from 'renderer/assets/svg/icon-download.svg';
import IconShield from 'renderer/assets/svg/icon-shield.svg';
import IconMenu from 'renderer/assets/svg/icon-menu.svg';

import { DIALOG_EVENTS } from 'constants/event-names';
import { DARK } from 'constants/theme';
import { isURL } from 'common';

import Button, { ButtonBadge } from 'renderer/components/Button';
import { AddressBarContainer, AddressBar, InputContainer, Input, Text, NavigationButton } from './style';

import AddressBarState from './state';
import TabBarState from '../TabBar/state';

const AddressBard = () => {
  const { windowId, onGoBack, onGoForward, onReload, onStop, onLoadURL } = TabBarState.useContainer();
  const {
    activeTab,
    isSearchBarFocused,
    handleSearchBarFocusChange,
    url: inputValue,
    handleInputValueChange,
    urlSegments,
  } = AddressBarState.useContainer();

  const onFocus = useCallback(
    (e) => {
      handleSearchBarFocusChange(true)();

      requestAnimationFrame(() => e.target.select());
    },
    [activeTab],
  );

  const onBlur = useCallback(
    (e) => {
      e.currentTarget.blur();
      window.getSelection().removeAllRanges();

      handleSearchBarFocusChange(false)();

      ipcRenderer.send(DIALOG_EVENTS.HIDE_ALL_DIALOG);
    },
    [activeTab],
  );

  const onKeyDown = useCallback(
    async (e) => {
      const target = e.currentTarget;

      if (e.key === 'Escape') {
        e.preventDefault();

        handleInputValueChange(activeTab.url.original);

        requestAnimationFrame(() => target.select());

        ipcRenderer.send(DIALOG_EVENTS.HIDE_ALL_DIALOG);

        return;
      }

      if (e.key === 'Enter') {
        e.currentTarget.blur();

        const { text, isSearchTerm } = activeTab.url;

        let url = text;

        if (isSearchTerm) {
          url = `https://google.com/search?q=${encodeURIComponent(text)}`;
        } else if (isURL(text)) {
          url = text.indexOf('://') === -1 ? `http://${text}` : text;
        } else {
          url = `https://google.com/search?q=${encodeURIComponent(text)}`;
        }

        onLoadURL(activeTab?.id, url)();

        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();

        ipcRenderer.send('suggestion:forwarding-keydown', e.key);
      }
    },
    [activeTab, handleInputValueChange],
  );

  const onInput = useCallback(
    async (e) => {
      const v = e.currentTarget.value;
      ipcRenderer.send(windowId, DIALOG_EVENTS.SHOW_SUGGESTION_DIALOG, v);
    },
    [inputValue],
  );

  return (
    <AddressBarContainer>
      <NavigationButton disabled={!activeTab?.canGoBack} onClick={onGoBack(activeTab?.id)}>
        <IconBack color={DARK.TEXT_COLOR} />
      </NavigationButton>

      <NavigationButton disabled={!activeTab?.canGoForward} onClick={onGoForward(activeTab?.id)}>
        <IconForward color={DARK.TEXT_COLOR} />
      </NavigationButton>

      <NavigationButton onClick={activeTab?.loading ? onStop(activeTab?.id) : onReload(activeTab?.id)}>
        {!activeTab?.loading && <IconRefresh color={DARK.TEXT_COLOR} />}

        {!!activeTab?.loading && <IconClose color={DARK.TEXT_COLOR} />}
      </NavigationButton>

      <NavigationButton>
        <IconHome color={DARK.TEXT_COLOR} />
      </NavigationButton>

      <AddressBar id='address-bar'>
        <Button topRightRadius={0} bottomRightRadius={0}>
          <IconLock color={DARK.TEXT_COLOR} />
        </Button>

        <InputContainer>
          <Input
            spellCheck={false}
            visible={isSearchBarFocused}
            onChange={(e) => handleInputValueChange(e.target.value)}
            value={activeTab?.url?.text || ''}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onInput={onInput}
          />

          <Text visible={!isSearchBarFocused}>
            {urlSegments instanceof URL && (
              <>
                <div style={{ opacity: 0.5 }}>{`${urlSegments.protocol}${
                  ['file', 'http'].some((protocol) => urlSegments.href.startsWith(protocol)) ? '//' : ''
                }`}</div>
                <div>{urlSegments.hostname}</div>
                <div style={{ opacity: 0.5 }}>
                  {urlSegments.href.replace(urlSegments.origin, '').replace(urlSegments.protocol, '')}
                </div>
              </>
            )}

            {!(urlSegments instanceof URL) && <div>{urlSegments.toString()}</div>}
          </Text>
        </InputContainer>

        <Button topLeftRadius={0} bottomLeftRadius={0}>
          <IconStar color={DARK.TEXT_COLOR} />
        </Button>
      </AddressBar>

      <NavigationButton>
        <IconDownload color={DARK.TEXT_COLOR} />
      </NavigationButton>

      <NavigationButton as={ButtonBadge} label={activeTab?.blockedAds}>
        <IconShield color={DARK.TEXT_COLOR} />
      </NavigationButton>

      <NavigationButton
        id='btn-quick-menu'
        onClick={() => {
          ipcRenderer.send(windowId, DIALOG_EVENTS.SHOW_SETTINGS_DIALOG);
        }}>
        <IconMenu color={DARK.TEXT_COLOR} />
      </NavigationButton>
    </AddressBarContainer>
  );
};

export default memo(AddressBard);
