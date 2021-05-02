import 'root/renderer/styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import TabBar from './components/TabBar';

const App = () => (
  <div>
    <TabBar />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
