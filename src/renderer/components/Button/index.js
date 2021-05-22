import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';

function parseRadiusValue(value) {
  return typeof value === 'number' ? `${value}px` : value;
}

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
  padding: 2px;
  border-radius: 4px;

  ${({ disable, size, topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius }) => css`
    width: ${size}px;
    height: ${size}px;
    min-width: ${size}px;
    min-height: ${size}px;
    border-top-left-radius: ${parseRadiusValue(topLeftRadius)};
    border-top-right-radius: ${parseRadiusValue(topRightRadius)};
    border-bottom-left-radius: ${parseRadiusValue(bottomLeftRadius)};
    border-bottom-right-radius: ${parseRadiusValue(bottomRightRadius)};

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
  topLeftRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  topRightRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bottomLeftRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bottomRightRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Button.defaultProps = {
  size: 24,
};

export default Button;
