/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';

const style = css`
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
    border: 0.13rem solid rgba(33, 136, 255, 1);
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: rgba(33, 136, 255, 1) transparent transparent transparent;
  }
  .lds-ring div:nth-of-type(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-of-type(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-of-type(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Spinner = () => (
  <div css={style}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default React.memo(Spinner);
