import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import { ipcRenderer } from 'electron';

import Spinner from 'renderer/components/Spinner';
import Button from 'renderer/components/Button';
import IconClose from 'renderer/assets/svg/icon-close.svg';
import IconWorld from 'renderer/assets/svg/icon-world.svg';
import IconVolume from 'renderer/assets/svg/icon-volume.svg';
import IconMute from 'renderer/assets/svg/icon-mute.svg';

import { TAB_EVENTS } from 'constants/event-names';
import { DARK } from 'constants/theme';
import TabBarState from './state';

import { Tab, TabFavicon, TabTitle, ButtonCloseTab } from './style';

const moveItemNextTo = (source, from, to) => {
  const arr = [].concat(source);

  arr.splice(to, 0, arr.splice(from, 1)[0]);

  return arr;
};

const DraggableTab = ({ index }) => {
  let hovered = false;

  const {
    handleLoadCommit,
    handleTitleChange,
    handleFaviconChange,
    handleLoadingChange,
    handleNavigationStateChange,
    handleUrlChange,
    handleMediaIsPlayingChange,
    handleMuteChange,
    handleUnmuteChange,
    handleAdsCounting,
    tabs,
    setTabs,
    handleTabChange,
    handleCloseTab,
    handlePreventDoubleClick,
    handleDragEnd,
    onContextMenu,
  } = TabBarState.useContainer();

  const tab = tabs[index];

  const hasFavicon = !!tab.favicon && typeof tab.favicon === 'string' && tab.favicon.startsWith('http');

  useEffect(() => {
    const listener = (e, event, message, ...args) => {
      // console.log('🚀 ~ file: Tab.js ~ line 44 ~ listener ~ event, message', event, message);
      if (event === TAB_EVENTS.LOAD_COMMIT) {
        // reset ...
        const [, , isMainFrame] = [message, ...args];
        if (isMainFrame) {
          handleLoadCommit(tab.id);
        }
      }

      if (event === TAB_EVENTS.UPDATE_TITLE) {
        handleTitleChange(tab.id, message);
      }

      if (event === TAB_EVENTS.UPDATE_FAVICON) {
        handleFaviconChange(tab.id, message);
      }

      if (event === TAB_EVENTS.UPDATE_LOADING) {
        handleLoadingChange(tab.id, message);
      }

      if (event === TAB_EVENTS.UPDATE_NAVIGATION_STATE) {
        handleNavigationStateChange(tab.id, message);
      }

      if (event === TAB_EVENTS.UPDATE_URL) {
        const opts = args[0];
        console.log('<<<<<', message, ...args);

        handleUrlChange(tab.id, message, opts);
      }

      if (event === TAB_EVENTS.MEDIA_IS_PLAYING) {
        handleMediaIsPlayingChange(tab.id, message);
      }

      if (event === TAB_EVENTS.ADS_COUNTING) {
        handleAdsCounting(tab.id);
      }
    };

    ipcRenderer.addListener(tab.id, listener);
    return () => ipcRenderer.removeListener(tab.id, listener);
  }, [tabs]);

  const ref = useRef();

  // handle drag & drop
  const [{ handlerId, isDragging }, drag] = useDrag({
    type: 'tab',
    item: { tab, index },
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
      isDragging: monitor.isDragging(),
    }),
    isDragging: (monitor) => tab.id === monitor.getItem().tab.id,
    end: (item) => {
      const from = index;
      const to = item.index;

      handleDragEnd(from, to);
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'tab',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item) => {
      if (!ref.current) {
        return;
      }

      if (item.tab.id !== tab.id) {
        setTabs((his) => moveItemNextTo(his, item.index, index));
      }

      // const dragIndex = item.index;
      // const hoverIndex = index;

      // // Don't replace items with themselves
      // if (dragIndex === hoverIndex) {
      //   return;
      // }
      // // Determine rectangle on screen
      // // const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // const hoverBoundingRect = ref.current?.parentNode.getBoundingClientRect();

      // // Get horizontal middle
      // const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      // // Determine mouse position
      // const clientOffset = monitor.getClientOffset();
      // // Get pixels to the left
      // const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      // // Only perform the move when the mouse has crossed half of the items height
      // // When dragging downwards, only move when the cursor is below 50%
      // // When dragging upwards, only move when the cursor is above 50%
      // // Dragging downwards
      // if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      //   return;
      // }
      // // Dragging upwards
      // if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      //   return;
      // }
      // // Time to actually perform the action

      // setTabs((his) => moveItemNextTo(his, dragIndex, hoverIndex));

      // // Note: we're mutating the monitor item here!
      // // Generally it's better to avoid mutations,
      // // but it's good here for the sake of performance
      // // to avoid expensive index searches.
      item.index = index;
    },
  });

  drag(drop(ref));

  // scroll to end
  useEffect(() => {
    function animationEndListener(e) {
      e.currentTarget.scrollIntoView();

      e.currentTarget.removeEventListener('animationend', this);
      e.currentTarget.removeEventListener('webkitAnimationEnd', this);
    }

    ref.current.addEventListener('animationend', animationEndListener);
    ref.current.addEventListener('webkitAnimationEnd', animationEndListener);
  }, []);

  const lastTabElement = document.getElementById(`tab-${tabs.length - 1}`);

  const rect = lastTabElement?.getBoundingClientRect?.();

  // handle tab preview
  const hidePreviewTab = () => {
    hovered = false;

    ipcRenderer.send(`${TAB_EVENTS.MOUSE_LEAVE}-${tab.id}`);
  };

  const onMouseDown = () => {
    hidePreviewTab();

    handleTabChange(index)();
  };

  const onMouseOver = (e) => {
    if (isDragging || isOver) {
      e.preventDefault();

      return;
    }

    if (hovered) return;

    hovered = true;

    const rectOfCurrentElement = e.currentTarget.getBoundingClientRect();
    ipcRenderer.send(
      `${TAB_EVENTS.MOUSE_OVER}-${tab.id}`,
      {
        top: rectOfCurrentElement.top,
        right: rectOfCurrentElement.right,
        bottom: rectOfCurrentElement.bottom,
        left: rectOfCurrentElement.left,
        width: rectOfCurrentElement.width,
        height: rectOfCurrentElement.height,
        x: rectOfCurrentElement.x,
        y: rectOfCurrentElement.y,
      },
      !tab.active,
    );
  };

  return (
    <Tab
      ref={ref}
      data-handler-id={handlerId}
      id={`tab-${index}`}
      active={tab.active}
      animationSize={rect?.left}
      zIndex={tabs.length - index}
      onDoubleClick={handlePreventDoubleClick}
      onContextMenu={onContextMenu(index)}
      onMouseDown={onMouseDown}
      onMouseUp={hidePreviewTab}
      onMouseLeave={hidePreviewTab}
      onMouseOver={onMouseOver}>
      {!tab.loading && (
        <TabFavicon>
          {hasFavicon ? (
            <img src={tab.favicon} width={16} height={16} />
          ) : (
            <IconWorld color={DARK.TEXT_COLOR} width={40} height={40} />
          )}
        </TabFavicon>
      )}

      {tab.loading && <Spinner />}

      <TabTitle>{tab.title}</TabTitle>

      {tab.mediaIsPlaying && (
        <>
          {!tab.isMuted && (
            <Button size={18} style={{ padding: 2 }} onClick={handleMuteChange(tab.id)}>
              <IconVolume color={DARK.TEXT_COLOR} />
            </Button>
          )}

          {tab.isMuted && (
            <Button size={18} style={{ padding: 2 }} onClick={handleUnmuteChange(tab.id)}>
              <IconMute color={DARK.TEXT_COLOR} />
            </Button>
          )}
        </>
      )}

      <ButtonCloseTab
        size={24}
        title='Close Tab'
        onClick={handleCloseTab(index)}
        onContextMenu={(e) => e.stopPropagation()}
        onDoubleClick={handlePreventDoubleClick}>
        <IconClose color={DARK.TEXT_COLOR} />
      </ButtonCloseTab>
    </Tab>
  );
};

DraggableTab.propTypes = {
  index: PropTypes.number,
};

export default memo(DraggableTab);
