import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { DARK, PADDING, RADIUS } from 'constants/theme';

function parseRadiusValue(value) {
  return typeof value === 'number' ? `${value}px` : value;
}

const Button = styled.div`
  display: inherit;
  padding: ${PADDING}px;
  border-radius: ${RADIUS}px;

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
      background-color: ${DARK.HOVER_COLOR};
    }
    &:active {
      background-color: ${DARK.ACTIVE_COLOR};
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
  size: 28,
};

export default Button;
