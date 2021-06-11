import React, { memo, useCallback, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

import { PERMISSION_STATE_ALLOW, PERMISSION_STATE_BLOCK, PERMISSION_STATE_PROMPT } from 'constants/permission-states';

import { ButtonIcon } from 'renderer/components/Button';
import IconClose from 'renderer/assets/svg/icon-close.svg';
import IconNotification from 'renderer/assets/svg/icon-notification.svg';
import IconLocation from 'renderer/assets/svg/icon-location.svg';
import IconMicrophone from 'renderer/assets/svg/icon-microphone.svg';
import IconVideo from 'renderer/assets/svg/icon-video.svg';
import IconMidi from 'renderer/assets/svg/icon-midi.svg';

import { PermissionContainer, Title, Description, Buttons, RequestButton } from './style';

const parsePermission = (permission) => {
  if (permission === 'notifications') {
    return { text: 'Show notifications', Icon: IconNotification };
  }

  if (permission === 'microphone') {
    return { text: 'Use your microphone', Icon: IconMicrophone };
  }

  if (permission === 'camera') {
    return { text: 'Use your camera', Icon: IconVideo };
  }

  if (permission === 'geolocation') {
    return { text: 'Know your location', Icon: IconLocation };
  }

  if (permission === 'midiSysex') {
    return { text: 'Use your MIDI devices', Icon: IconMidi };
  }

  return null;
};

const Permission = () => {
  const [perm, setPerm] = useState({});

  const onClick = useCallback(
    (result) => () => {
      const viewId = ipcRenderer.sendSync('get-current-view-id');

      ipcRenderer.send(`result-${viewId}`, result);
    },
    [],
  );

  useEffect(() => {
    const dialogId = ipcRenderer.sendSync('get-webcontents-id');

    const permission = ipcRenderer.sendSync(`get-permission-${dialogId}`);
    setPerm({ hostname: permission.hostname, ...parsePermission(permission.name) });
  }, []);

  if (Object.values(perm).length === 0) return null;

  return (
    <PermissionContainer>
      <ButtonIcon
        size={20}
        src={IconClose}
        srcSize={12}
        style={{ marginLeft: 'auto' }}
        onClick={onClick(PERMISSION_STATE_PROMPT)}
      />

      <Title>{perm.hostname} wants to</Title>
      <Description>
        <perm.Icon /> <div>{perm.text}</div>
      </Description>

      <Buttons>
        <RequestButton onClick={onClick(PERMISSION_STATE_BLOCK)}>Block</RequestButton>
        <RequestButton onClick={onClick(PERMISSION_STATE_ALLOW)}>Allow</RequestButton>
      </Buttons>
    </PermissionContainer>
  );
};

export default memo(Permission);
