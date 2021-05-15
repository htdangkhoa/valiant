import React, { memo, useRef, useEffect, useCallback } from 'react';
import * as ElectronRemote from '@electron/remote';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import IconAdd from 'root/renderer/assets/svg/icon-add.svg';
import Tab from './Tab';
import TabBarState from './state';

import './style.scss';

const TabBarView = () => {
  const { tabs, handleAddNewTab, handlePreventDoubleClick } = TabBarState.useContainer();

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

  const onDoubleClick = useCallback(() => {
    if (win.isMaximized()) {
      win.unmaximize();

      return;
    }

    win.maximize();
  }, []);

  return (
    <div className='tabs-container' onDoubleClick={onDoubleClick}>
      <div className='tabs' ref={ref}>
        {tabs.map((tab, i) => (
          <Tab key={`tab=${i}`} index={i} />
        ))}
      </div>

      <div
        className='btn btn-add mx-4'
        title='New Tab'
        onClick={handleAddNewTab({ active: true })}
        onDoubleClick={handlePreventDoubleClick}>
        <IconAdd fill='#ffffff' />
      </div>
    </div>
  );
};

const TabBar = () => (
  <DndProvider backend={HTML5Backend}>
    <TabBarView />
  </DndProvider>
);

export default memo(TabBar);
