import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

import TabBar from './TabBar';
import AddressBar from './AddressBar';

import TabBarState from './TabBar/state';
import AddressBarState from './AddressBar/state';

const StyledToolbar = styled.div`
  display: ${(props) => (props.isFullscreen ? 'none' : 'block')};
`;

const ToolbarView = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const listener = (e, fullscreen) => setIsFullscreen(fullscreen);

    ipcRenderer.on('fullscreen', listener);
    return () => ipcRenderer.removeListener('fullscreen', listener);
  }, []);

  return (
    <StyledToolbar id='toolbar' isFullscreen={isFullscreen}>
      <TabBar />

      <AddressBar />
    </StyledToolbar>
  );
};

const Toolbar = () => (
  <TabBarState.Provider>
    <AddressBarState.Provider>
      <ToolbarView />
    </AddressBarState.Provider>
  </TabBarState.Provider>
);

export default memo(Toolbar);
