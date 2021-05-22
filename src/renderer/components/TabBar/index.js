import React, { memo, useRef, useEffect, useCallback } from 'react';
import * as ElectronRemote from '@electron/remote';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import IconAdd from 'renderer/assets/svg/icon-add.svg';

import { TabContainer, Tabs, ButtonNewTab } from './style';
import DraggableTab from './DraggableTab';
import TabBarState from './state';

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
    <TabContainer onDoubleClick={onDoubleClick}>
      <Tabs ref={ref}>
        {tabs.map((tab, i) => (
          <DraggableTab key={`tab-${i}`} index={i} />
        ))}
      </Tabs>

      <ButtonNewTab
        size={28}
        title='New Tab'
        onClick={handleAddNewTab({ active: true })}
        onDoubleClick={handlePreventDoubleClick}>
        <IconAdd color='#ffffff' />
      </ButtonNewTab>
    </TabContainer>
  );
};

const TabBar = () => (
  <DndProvider backend={HTML5Backend}>
    <TabBarView />
  </DndProvider>
);

export default memo(TabBar);
