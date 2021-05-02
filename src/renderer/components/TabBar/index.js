import React, { memo, useRef, useEffect, useCallback } from 'react';
import { ipcRenderer, ipcMain, remote } from 'electron';
import './style.scss';

import Close from '../../assets/svg/close.svg';

const TabBar = () => {
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

  const onClose = useCallback(() => {
    const win = remote.getCurrentWindow();

    const browserView = win.getBrowserView();

    if (browserView) {
      win.removeBrowserView(browserView);
    }
  }, []);

  return (
    <div className='tabs-container'>
      <div className='tabs' ref={ref}>
        {[...Array(20)].map((_, i) => (
          <div key={i.toString()} className='tab flex items-center'>
            <p title='Touch ID trên bàn phím Magic Keyboard mới không thể dùng được với iPad Pro M1 và các máy Mac Intel | Tinh tế'>
              Touch ID trên bàn phím Magic Keyboard mới không thể dùng được với iPad Pro M1 và các máy Mac Intel | Tinh
              tế
            </p>

            <div className='btn-close' onClick={onClose}>
              <Close fill='#ffffff' style={{ width: 16, height: 16 }} />
            </div>
          </div>
        ))}
      </div>

      <button
        type='button'
        onClick={() => {
          ipcRenderer.send('new_tab', 'hahaha');
        }}>
        +
      </button>
    </div>
  );
};

export default memo(TabBar);
