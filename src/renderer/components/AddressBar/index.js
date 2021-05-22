import React, { memo, useCallback } from 'react';

import IconBack from 'renderer/assets/svg/icon-back.svg';
import IconForward from 'renderer/assets/svg/icon-forward.svg';
import IconRefresh from 'renderer/assets/svg/icon-refresh.svg';
import IconClose from 'renderer/assets/svg/icon-close.svg';
import IconHome from 'renderer/assets/svg/icon-home.svg';
import IconLock from 'renderer/assets/svg/icon-lock.svg';
import IconStar from 'renderer/assets/svg/icon-star.svg';
import IconMenu from 'renderer/assets/svg/icon-menu.svg';

import { isURL } from 'common';

import Button from '../Button';
import { AddressBarContainer, AddressBar, InputContainer, Input, Text, NavigationButton } from './style';

import AddressBarState from './state';
import TabBarState from '../TabBar/state';

const AddressBard = () => {
  const { onGoBack, onGoForward, onReload, onStop, onLoadURL, handleUrlChange } = TabBarState.useContainer();
  const {
    activeTab,
    isSearchBarFocused,
    handleSearchBarFocusChange,
    url: inputValue,
    handleInputValueChange,
    urlSegments,
  } = AddressBarState.useContainer();

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
    <AddressBarContainer>
      <NavigationButton disable={!activeTab?.canGoBack} onClick={onGoBack(activeTab?.id)}>
        <IconBack color='#ffffff' />
      </NavigationButton>

      <NavigationButton disable={!activeTab?.canGoForward} onClick={onGoForward(activeTab?.id)}>
        <IconForward color='#ffffff' />
      </NavigationButton>

      <NavigationButton onClick={activeTab?.loading ? onStop(activeTab?.id) : onReload(activeTab?.id)}>
        {!activeTab?.loading && <IconRefresh color='#ffffff' />}

        {!!activeTab?.loading && <IconClose color='#ffffff' />}
      </NavigationButton>

      <NavigationButton>
        <IconHome color='#ffffff' />
      </NavigationButton>

      <AddressBar>
        <Button topRightRadius={0} bottomRightRadius={0}>
          <IconLock fill='#88cc88' />
        </Button>

        <InputContainer>
          <Input
            spellCheck={false}
            visible={isSearchBarFocused}
            value={inputValue}
            onChange={handleInputValueChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={async (e) => {
              const target = e.currentTarget;

              if (e.key === 'Escape') {
                await handleUrlChange(activeTab?.id, activeTab?.originalUrl);

                requestAnimationFrame(() => target.select());

                return;
              }

              if (e.key === 'Enter') {
                e.currentTarget.blur();

                const { value } = e.currentTarget;

                let url = value;

                if (isURL(value)) {
                  url = value.indexOf('://') === -1 ? `http://${value}` : value;
                } else {
                  url = `https://google.com/search?q=${value}`;
                }

                onLoadURL(activeTab?.id, url)();
              }
            }}
          />

          <Text visible={!isSearchBarFocused}>
            {urlSegments instanceof URL && (
              <>
                <div style={{ opacity: 0.5 }}>{`${urlSegments.protocol}//`}</div>
                <div>{urlSegments.hostname}</div>
                <div style={{ opacity: 0.5 }}>{urlSegments.href.replace(urlSegments.origin, '')}</div>
              </>
            )}

            {!(urlSegments instanceof URL) && <div>{urlSegments.toString()}</div>}
          </Text>
        </InputContainer>

        <Button topLeftRadius={0} bottomLeftRadius={0}>
          <IconStar color='#ffffff' />
        </Button>
      </AddressBar>

      <NavigationButton>
        <IconMenu color='#ffffff' />
      </NavigationButton>
    </AddressBarContainer>
  );
};

export default memo(AddressBard);
