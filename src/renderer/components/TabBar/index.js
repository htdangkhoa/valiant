import React, { memo, useRef, useEffect, useCallback } from 'react';
import * as ElectronRemote from '@electron/remote';
import './style.scss';

import IconAdd from 'root/renderer/assets/svg/icon-add.svg';
import IconClose from 'root/renderer/assets/svg/icon-close.svg';
import IconEarth from 'root/renderer/assets/svg/icon-earth.svg';

import Spinner from 'root/renderer/components/Spinner';
import ToolbarState from 'root/renderer/state';
import { classnames } from 'root/renderer/utils';

const TabBar = () => {
  const { tabs, handleTabChange, handleCloseTab, handleAddNewTab } = ToolbarState.useContainer();

  const win = ElectronRemote.getCurrentWindow();

  const ref = useRef();

  useEffect(() => {
    const ele = ref.current;

    if (ele) {
      const onWheel = (e) => {
        if (e.deltaY === 0) return;

        e.preventDefault();

        ele.scrollTo({
          left: ele.scrollLeft + e.deltaY,
          behavior: 'smooth',
        });
      };

      ele.addEventListener('wheel', onWheel);
      return () => ele.removeEventListener('wheel', onWheel);
    }
  }, []);

  // scroll to end
  useEffect(() => {
    const currentTab = tabs.find((tab) => !!tab.active);

    if (currentTab) {
      document.querySelector(`[id='${currentTab.id}']`).scrollIntoView();
    }
  }, [tabs]);

  const onDoubleClick = useCallback(() => {
    if (win.isMaximized()) {
      win.unmaximize();

      return;
    }

    win.maximize();
  }, []);

  const onPreventDoubleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    [tabs],
  );

  return (
    <div className='tabs-container' onDoubleClick={onDoubleClick}>
      <div className='tabs' ref={ref}>
        {tabs.map((tab, i) => {
          const hasFavicon = !!tab.favicon && typeof tab.favicon === 'string' && tab.favicon.startsWith('http');

          return (
            <div
              key={tab.id}
              id={tab.id}
              className={classnames('tab flex items-center', tab.active && 'active')}
              onClick={() => handleTabChange(i)}
              onDoubleClick={onPreventDoubleClick}
              title={tab.title}>
              {!tab.loading && (
                <>
                  {hasFavicon && <img className='favicon mx-4' src={tab.favicon} width={16} height={16} />}

                  {!hasFavicon && (
                    <div className='flex mx-4'>
                      <IconEarth fill='#ffffff' width={23} height={23} />
                    </div>
                  )}
                </>
              )}

              {tab.loading && <Spinner className='mx-4' />}

              <p className='mx-4' title={tab.title}>
                {tab.title}
              </p>

              <div
                className='btn btn-close p-0'
                title='Close Tab'
                onClick={(e) => {
                  e.stopPropagation();

                  handleCloseTab(i);
                }}
                onDoubleClick={onPreventDoubleClick}>
                <IconClose fill='#ffffff' />
              </div>
            </div>
          );
        })}
      </div>

      <div className='btn btn-add mx-4' title='New Tab' onClick={handleAddNewTab} onDoubleClick={onPreventDoubleClick}>
        <IconAdd fill='#ffffff' />
      </div>
    </div>
  );
};

export default memo(TabBar);
