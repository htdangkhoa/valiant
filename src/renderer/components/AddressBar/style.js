import styled from '@emotion/styled';
import { css } from '@emotion/react';

const font = () => css`
  font-family: inherit;
  word-spacing: inherit;
  font-size: 14px;
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex: 1;
`;

export const Input = styled.input`
  outline: none;
  border: none;
  width: 100%;
  height: auto;
  padding: 0 4px;

  ${font};

  ${({ visible }) => css`
    color: ${visible ? 'inherit' : 'transparent'};
  `}
`;

export const Text = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  overflow: hidden;
  white-space: nowrap;
  pointer-events: none;
  margin: 0 4px;

  ${font};

  ${({ visible }) => css`
    display: ${visible ? 'flex' : 'none'};
  `}
`;
