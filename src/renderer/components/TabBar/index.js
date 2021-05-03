import React, { memo, useRef, useEffect, useCallback, useState } from 'react';
import { ipcRenderer, remote } from 'electron';
import './style.scss';

import IconAdd from 'root/renderer/assets/svg/icon-add.svg';
import Close from '../../assets/svg/close.svg';

import ToolbarState from 'root/renderer/state';
import { classnames } from 'root/renderer/utils';
import { CLOSE_TAB, NEW_TAB, SWITCH_TAB } from 'root/constants/event-names';

const TabBar = () => {
  const { tabs } = ToolbarState.useContainer();

  const win = remote.getCurrentWindow();

  const ref = useRef();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const ele = ref.current;

    if (ele) {
      const onWheel = (e) => {
        e.preventDefault();

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

  const onDoubleClick = useCallback(() => {
    if (win.isMaximized()) {
      win.unmaximize();

      return;
    }

    win.maximize();
  }, []);

  const onClose = useCallback(
    (i) => {
      const currentTab = tabs[i];

      ipcRenderer.send(CLOSE_TAB, { id: currentTab.id });
    },
    [tabs],
  );

  const onAddNewTab = useCallback(() => {
    ipcRenderer.send(NEW_TAB);
  }, []);

  const onClick = useCallback(
    (i) => {
      const currentTab = tabs[i];

      ipcRenderer.send(SWITCH_TAB, { id: currentTab.id });
    },
    [tabs],
  );

  const overrideOnDoubleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    [tabs],
  );

  return (
    <div className='tabs-container' onDoubleClick={onDoubleClick}>
      <div className='tabs' ref={ref}>
        {tabs.map((tab, i) => (
          <div
            key={tab.id}
            className={classnames('tab flex items-center', tab.active && 'active')}
            onClick={() => onClick(i)}
            onDoubleClick={overrideOnDoubleClick}>
            <p title='Touch ID trên bàn phím Magic Keyboard mới không thể dùng được với iPad Pro M1 và các máy Mac Intel | Tinh tế'>
              Touch ID trên bàn phím Magic Keyboard mới không thể dùng được với iPad Pro M1 và các máy Mac Intel | Tinh
              tế
            </p>

            <div
              className='btn btn-close p-0'
              onClick={(e) => {
                e.stopPropagation();

                onClose(i);
              }}
              onDoubleClick={overrideOnDoubleClick}>
              <Close fill='#ffffff' />
            </div>
          </div>
        ))}
      </div>

      <div className='btn btn-add mx-4' onClick={onAddNewTab} onDoubleClick={overrideOnDoubleClick}>
        <IconAdd fill='#ffffff' />
      </div>
    </div>
  );
};

export default memo(TabBar);
