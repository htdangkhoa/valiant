import React from 'react';

import TabBar from 'renderer/components/TabBar';
import AddressBar from 'renderer/components/AddressBar';

import TabBarState from 'renderer/components/TabBar/state';
import AddressBarState from 'renderer/components/AddressBar/state';

const Toolbar = () => (
  <div id='toolbar'>
    <TabBar />

    <AddressBar />
  </div>
);

const App = () => (
  <TabBarState.Provider>
    <AddressBarState.Provider>
      <Toolbar />
    </AddressBarState.Provider>
  </TabBarState.Provider>
);

export default App;
