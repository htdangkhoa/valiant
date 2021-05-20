import 'renderer/styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import TabBar from 'renderer/components/TabBar';
import AddressBar from 'renderer/components/AddressBar';

import TabBarState from 'renderer/components/TabBar/state';
import AddressBarState from 'renderer/components/AddressBar/state';

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
