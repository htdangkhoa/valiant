import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const Svg = styled.svg`
  transform: rotate(-90deg);
`;

const Circle = styled.circle`
  transition: 0.2s stroke-dashoffset;
  transform-origin: 50% 50%;
`;

const ProgressBar = ({ size, strokeWidth, color, progress }) => {
  const ref = useRef();

  useEffect(() => {
    const radius = ref.current.r.baseVal.value;

    const circumference = radius * 2 * Math.PI;

    // init
    ref.current.style.strokeDasharray = `${circumference} ${circumference}`;
    ref.current.style.strokeDashoffset = `${circumference}`;
  }, []);

  useEffect(() => {
    const radius = ref.current.r.baseVal.value;

    const circumference = radius * 2 * Math.PI;

    const dashOffset = circumference - (progress / 100) * circumference;

    ref.current.style.strokeDashoffset = dashOffset;
  }, [progress]);

  return (
    <Svg width={size} height={size}>
      <Circle
        ref={ref}
        strokeWidth={strokeWidth}
        stroke={color}
        fill='none'
        r={size / 2 - 2}
        cx={size / 2}
        cy={size / 2}
      />
    </Svg>
  );
};

ProgressBar.propTypes = {
  size: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  progress: PropTypes.number,
};

ProgressBar.defaultProps = {
  progress: 0,
};

export default memo(ProgressBar);
