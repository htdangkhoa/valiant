import React from 'react';

import IconClose from 'renderer/assets/svg/icon-close.svg';
import IconChevronUp from 'renderer/assets/svg/icon-chevron-up.svg';
import IconChevronDown from 'renderer/assets/svg/icon-chevron-down.svg';
import { ButtonIcon } from 'renderer/components/Button';

import { DialogContainer, Input, Label, Separator } from './style';

const Find = () => (
  <DialogContainer>
    <Input />
    <Label>0/0</Label>
    <Separator />
    <ButtonIcon src={IconChevronUp} />
    <ButtonIcon src={IconChevronDown} />
    <ButtonIcon src={IconClose} srcSize={16} />
  </DialogContainer>
);

export default Find;
