import React from 'react';
import './style.scss';

import IconBack from 'root/renderer/assets/svg/icon-back.svg';
import IconForward from 'root/renderer/assets/svg/icon-forward.svg';
import IconRefresh from 'root/renderer/assets/svg/icon-refresh.svg';
import IconLock from 'root/renderer/assets/svg/icon-lock.svg';
import IconStar from 'root/renderer/assets/svg/icon-start.svg';
import IconMenu from 'root/renderer/assets/svg/icon-menu.svg';

const AddressBard = () => (
  <div className='address-bar flex'>
    <div className='btn'>
      <IconBack fill='#ffffff' width={16} height={16} />
    </div>

    <div className='btn'>
      <IconForward fill='#ffffff' width={16} height={16} />
    </div>

    <div className='btn'>
      <IconRefresh fill='#ffffff' width={16} height={16} />
    </div>

    <div className='search-field flex'>
      <div className='btn'>
        <IconLock fill='#ffffff' width={16} height={16} />
      </div>

      <input type='text' />

      <div className='btn'>
        <IconStar fill='#ffffff' width={16} height={16} />
      </div>
    </div>

    <div className='btn'>
      <IconMenu fill='#ffffff' width={16} height={16} />
    </div>
  </div>
);

export default AddressBard;
