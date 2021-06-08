import React, { memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { HIGHLIGHT_COLOR } from 'constants/theme';

const ring = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.div`
  display: table;
  position: relative;
  width: 16px;
  height: 16px;
  margin-left: 4px;
  margin-right: 4px;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    border: 0.13rem solid ${HIGHLIGHT_COLOR};
    border-radius: 50%;
    animation: ${ring} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${HIGHLIGHT_COLOR} transparent transparent transparent;

    &:nth-of-type(1) {
      animation-delay: -0.45s;
    }
    &:nth-of-type(2) {
      animation-delay: -0.3s;
    }
    &:nth-of-type(3) {
      animation-delay: -0.15s;
    }
  }
`;

const Spinner = () => (
  <StyledSpinner>
    <div />
    <div />
    <div />
    <div />
  </StyledSpinner>
);

export default memo(Spinner);
