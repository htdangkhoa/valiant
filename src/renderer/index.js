import 'root/renderer/styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import TabBar from 'root/renderer/components/TabBar';
import AddressBar from 'root/renderer/components/AddressBar';

import ToolbarState from './state';

const ToolbarView = () => (
  <div id='toolbar'>
    <TabBar />

    <AddressBar />
  </div>
);

const Toolbar = () => (
  <ToolbarState.Provider>
    <ToolbarView />
  </ToolbarState.Provider>
);

ReactDOM.render(<Toolbar />, document.getElementById('app'));
