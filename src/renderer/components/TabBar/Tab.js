import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import { ipcRenderer } from 'electron';

import Spinner from 'root/renderer/components/Spinner';
import IconClose from 'root/renderer/assets/svg/icon-close.svg';
import IconEarth from 'root/renderer/assets/svg/icon-earth.svg';

import { classnames } from 'root/renderer/utils';
import ToolbarState from 'root/renderer/state';

const moveItemNextTo = (source, from, to) => {
  const arr = [].concat(source);

  arr.splice(to, 0, arr.splice(from, 1)[0]);

  return arr;
};

const Tab = ({ index }) => {
  const { tabs, setTabs, handleTabChange, handleCloseTab, handlePreventDoubleClick } = ToolbarState.useContainer();

  const tab = tabs[index];

  const hasFavicon = !!tab.favicon && typeof tab.favicon === 'string' && tab.favicon.startsWith('http');

  const ref = useRef();

  const [{ isDragging, handlerId }, drag] = useDrag({
    type: 'tab',
    item: { tab, index },
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'tab',
    hover: (item, monitor) => {
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

  // scroll to end
  useEffect(() => {
    ref.current.scrollIntoView();
  }, []);

  drag(drop(ref));

  useEffect(() => {
    const listener = (e) => {
      e.preventDefault();

      ipcRenderer.send('contextmenu');
    };

    ref.current.addEventListener('contextmenu', listener);
    return () => ref.current?.removeEventListener?.('contextmenu', listener);
  }, [drag, drop]);

  useEffect(() => {
    const ele = document.querySelector('.btn-close');

    if (!ele) return;

    const listener = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    ele.addEventListener('contextmenu', listener);
    return () => ele.removeEventListener('contextmenu', listener);
  }, []);

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={classnames('tab flex items-center', tab.active && 'active')}
      onClick={() => handleTabChange(index)}
      onDoubleClick={handlePreventDoubleClick}>
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

      <p className='mx-4'>{tab.title}</p>

      <div
        className='btn btn-close p-0'
        title='Close Tab'
        onClick={(e) => {
          e.stopPropagation();

          handleCloseTab(index);
        }}
        onDoubleClick={handlePreventDoubleClick}>
        <IconClose fill='#ffffff' />
      </div>
    </div>
  );
};

Tab.propTypes = {
  index: PropTypes.number,
};

export default memo(Tab);
