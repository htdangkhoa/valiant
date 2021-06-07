import React, { memo, useRef, useEffect, useCallback } from 'react';
import { getCurrentWindow, systemPreferences } from '@electron/remote';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ipcRenderer } from 'electron';

import { DIALOG_EVENTS } from 'constants/event-names';
import { DARK } from 'constants/theme';
import IconAdd from 'renderer/assets/svg/icon-add.svg';

import { TabContainer, Tabs, ButtonNewTab } from './style';
import DraggableTab from './DraggableTab';
import TabBarState from './state';

const TabBarView = () => {
  const { tabs, handleAddNewTab, handlePreventDoubleClick } = TabBarState.useContainer();

  const win = getCurrentWindow();

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
    const doubleClickAction = systemPreferences.getUserDefault('AppleActionOnDoubleClick', 'string');

    if (doubleClickAction === 'Minimize') {
      win.minimize();
    } else if (doubleClickAction === 'Maximize') {
      if (!win.isMaximized()) {
        win.maximize();
      } else {
        win.unmaximize();
      }
    }
  }, []);

  const onMouseDown = useCallback(() => {
    ipcRenderer.send(DIALOG_EVENTS.HIDE_ALL_DIALOG);
  }, []);

  return (
    <TabContainer onDoubleClick={onDoubleClick} onMouseDown={onMouseDown}>
      <Tabs ref={ref}>
        {tabs.map((tab, i) => (
          <DraggableTab key={`tab-${tab.id}`} index={i} />
        ))}
      </Tabs>

      <ButtonNewTab
        size={28}
        title='New Tab'
        onClick={handleAddNewTab({ active: true })}
        onDoubleClick={handlePreventDoubleClick}>
        <IconAdd color={DARK.TEXT_COLOR} />
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
