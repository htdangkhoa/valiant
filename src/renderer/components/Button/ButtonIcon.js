import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { DARK } from 'constants/theme';

import Button from './Button';

const ButtonWrapper = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: ${(props) => (typeof props.srcSize === 'number' ? `${props.srcSize}px` : '100%')};
    height: ${(props) => (typeof props.srcSize === 'number' ? `${props.srcSize}px` : '100%')};
  }
`;

const ButtonIcon = ({ src: Icon, srcSize, ...props }) => (
  <ButtonWrapper srcSize={srcSize} {...props}>
    <Icon color={DARK.TEXT_COLOR} />
  </ButtonWrapper>
);

ButtonIcon.propTypes = {
  src: PropTypes.elementType.isRequired,
  srcSize: PropTypes.number,
};

export default ButtonIcon;
