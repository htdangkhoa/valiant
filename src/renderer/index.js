import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer, ipcMain } from 'electron';

import Img from './assets/image.jpg';
import Svg from './assets/vi_get.svg';

import './style.scss';

const App = () => {
  const ref = useRef();

  useEffect(() => {
    const ele = ref.current;

    if (ele) {
      const onWheel = (e) => {
        e.preventDefault();

        if (e.deltaY === 0) return;
        e.preventDefault();
        ele.scrollTo({
          left: ele.scrollLeft + e.deltaY,
          // behavior: 'smooth',
        });
      };

      ele.addEventListener('wheel', onWheel);
      return () => ele.removeEventListener('wheel', onWheel);
    }
  }, []);

  return (
    <div>
      {/* <button
        type='button'
        onClick={() => {
          ipcRenderer.send('new_tab', 'hahaha');
        }}>
        Click
      </button> */}

      <div className='tabs-container'>
        <div className='tabs' ref={ref}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className='tab'>
              Google {i}
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
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
