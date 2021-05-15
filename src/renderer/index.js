import 'root/renderer/styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import TabBar from 'root/renderer/components/TabBar';
import AddressBar from 'root/renderer/components/AddressBar';

import TabBarState from 'root/renderer/components/TabBar/state';
import AddressBarState from 'root/renderer/components/AddressBar/state';

const ToolbarView = () => (
  <div id='toolbar'>
    <TabBar />

    <AddressBar />
  </div>
);

const Toolbar = () => (
  <TabBarState.Provider>
    <AddressBarState.Provider>
      <ToolbarView />
    </AddressBarState.Provider>
  </TabBarState.Provider>
);

ReactDOM.render(<Toolbar />, document.getElementById('app'));
