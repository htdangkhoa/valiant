import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';

const BaseButton = ({ className, children, ...props }) => (
  <div {...props} className={className}>
    {children}
  </div>
);
BaseButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const Button = styled(BaseButton)`
  display: inherit;
  border-radius: 4px;
  padding: 4px;

  ${({ disable, size }) => css`
    width: ${size}px;
    height: ${size}px;

    pointer-events: ${disable ? 'none' : 'inherit'};
    opacity: ${disable ? '0.5' : '1'};

    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
    }
    &:active {
      background-color: rgba(255, 255, 255, 0.25);
    }
  `}
`;

Button.propTypes = {
  disable: PropTypes.bool,
  size: PropTypes.number,
};

Button.defaultProps = {
  size: 24,
};

export default Button;
