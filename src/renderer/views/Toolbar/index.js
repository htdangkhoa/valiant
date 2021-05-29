import React, { memo } from 'react';

import TabBar from './TabBar';
import AddressBar from './AddressBar';

import TabBarState from './TabBar/state';
import AddressBarState from './AddressBar/state';

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

export default memo(Toolbar);
