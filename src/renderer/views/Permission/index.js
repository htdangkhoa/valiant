import React, { memo, useCallback } from 'react';
import { ipcRenderer } from 'electron';

import { ButtonIcon } from 'renderer/components/Button';
import IconClose from 'renderer/assets/svg/icon-close.svg';
import IconNotification from 'renderer/assets/svg/icon-notification.svg';
import IconLocation from 'renderer/assets/svg/icon-location.svg';

import { PermissionContainer, Title, Description, Buttons, RequestButton } from './style';

const Permission = () => {
  const onClick = useCallback(
    (result) => () => {
      const dialogId = ipcRenderer.sendSync('get-webcontents-id');

      ipcRenderer.send(`result-${dialogId}`, result);
    },
    [],
  );

  return (
    <PermissionContainer>
      <ButtonIcon size={20} src={IconClose} srcSize={12} style={{ marginLeft: 'auto' }} onClick={onClick(-1)} />

      <Title>whatwebcando.today wants to</Title>
      <Description>
        <IconLocation /> <div>Know your location</div>
      </Description>

      <Buttons>
        <RequestButton onClick={onClick(0)}>Block</RequestButton>
        <RequestButton onClick={onClick(1)}>Allow</RequestButton>
      </Buttons>
    </PermissionContainer>
  );
};

export default memo(Permission);
