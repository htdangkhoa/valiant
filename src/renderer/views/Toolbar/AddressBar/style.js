import styled, { css } from 'styled-components';
import { DARK, RADIUS } from 'constants/theme';
import Button from 'renderer/components/Button';

const font = () => css`
  font-family: inherit;
  word-spacing: inherit;
  font-size: 14px;
`;

export const AddressBarContainer = styled.div`
  background-color: ${DARK.NAVIGATION_BAR};
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
`;

export const AddressBar = styled.div`
  display: flex;
  background-color: ${DARK.ADDRESS_BAR};
  border-radius: ${RADIUS}px;
  width: 100%;
  margin: auto 0.5rem;
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
  background-color: ${DARK.ADDRESS_BAR};

  :focus {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  ${font};

  ${({ visible }) => css`
    color: ${visible ? DARK.TEXT_COLOR : 'transparent'};
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
  color: ${DARK.TEXT_COLOR};

  ${font};

  ${({ visible }) => css`
    display: ${visible ? 'flex' : 'none'};
  `}
`;

export const NavigationButton = styled(Button)`
  &:not(:last-of-type) {
    margin: auto 0.5rem;
  }
  &:first-of-type {
    margin-left: 0;
  }
`;
