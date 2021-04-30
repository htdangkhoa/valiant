import React from 'react';
import ReactDOM from 'react-dom';

import Img from './assets/image.jpg';
import Svg from './assets/vi_get.svg';

import './style.scss';

const App = () => (
  <div>
    <p id='test'>Hello world!</p>

    <img src='assets/image.jpg' alt='1' />
    <img src={Img} alt='2' />

    <Svg />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
