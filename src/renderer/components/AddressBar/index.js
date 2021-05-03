import React, { memo, useCallback } from 'react';

import './style.scss';

import IconBack from 'root/renderer/assets/svg/icon-back.svg';
import IconForward from 'root/renderer/assets/svg/icon-forward.svg';
import IconRefresh from 'root/renderer/assets/svg/icon-refresh.svg';
import IconLock from 'root/renderer/assets/svg/icon-lock.svg';
import IconStar from 'root/renderer/assets/svg/icon-start.svg';
import IconMenu from 'root/renderer/assets/svg/icon-menu.svg';

import ToolbarState from 'root/renderer/state';

const AddressBard = () => {
  const { url, handleUrlChange, tabs } = ToolbarState.useContainer();

  const onRefresh = useCallback(() => {
    console.log(tabs);
  }, [tabs]);

  return (
    <div className='address-bar flex items-center'>
      <div className='btn w-24 h-24'>
        <IconBack fill='#ffffff' />
      </div>

      <div className='btn w-24 h-24'>
        <IconForward fill='#ffffff' />
      </div>

      <div className='btn w-24 h-24' onClick={onRefresh}>
        <IconRefresh fill='#ffffff' />
      </div>

      <div className='search-field flex'>
        <div className='btn w-24 h-24'>
          <IconLock fill='#ffffff' />
        </div>

        <input type='text' value={url} onChange={handleUrlChange} />

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
