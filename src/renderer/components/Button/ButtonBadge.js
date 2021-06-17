import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FONT_SIZES, HIGHLIGHT_COLOR, RADIUS } from 'constants/theme';
import Button from './Button';

const ButtonWrapper = styled(Button)`
  position: relative;
`;

const Badge = styled.div`
  position: absolute;
  font-size: ${FONT_SIZES.BUTTON_BADGE}px;
  line-height: ${FONT_SIZES.BUTTON_BADGE}px;
  color: white;
  background-color: ${HIGHLIGHT_COLOR};
  border-radius: ${RADIUS}px;
  padding: 2px;
  top: 2px;
  right: 2px;
  min-width: 12px;
  text-align: center;
`;

const ButtonBadge = ({ label, children, ...props }) => (
  <ButtonWrapper {...props}>
    {children}

    {![null, undefined, false].includes(label) && <Badge>{label}</Badge>}
  </ButtonWrapper>
);

ButtonBadge.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
};

export default ButtonBadge;
