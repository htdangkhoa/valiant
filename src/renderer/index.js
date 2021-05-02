import 'root/renderer/styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import TabBar from 'root/renderer/components/TabBar';
import AddressBar from 'root/renderer/components/AddressBar';

const App = () => (
  <div id='toolbar'>
    <TabBar />

    <AddressBar />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
