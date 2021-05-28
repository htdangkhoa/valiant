import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { TITLE_BAR_COLOR } from 'constants/theme';
import Button from '../Button';

export const TabContainer = styled.div`
  display: flex;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 7.5rem;
  padding-right: 5.5rem;
  -webkit-app-region: drag;
  background-color: ${TITLE_BAR_COLOR};

  * {
    -webkit-app-region: no-drag;
  }
`;

export const Tabs = styled.div`
  display: flex;
  gap: 4px;

  overflow-y: hidden;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    width: 0px;
    height: 0;
    background: transparent; /* make scrollbar transparent */
  }
`;

export const Tab = styled.div`
  @keyframes slide-in {
    0% {
      left: -100px;
    }
    100% {
      left: 0;
    }
  }

  animation: slide-in 0.2s;

  border-radius: 4px;
  min-width: 100px;
  padding: 4px;
  max-width: 18em;
  width: 100vw;
  font-size: 0.75rem;
  position: relative;
  background-color: rgb(43, 42, 50);
  display: flex;
  align-items: center;

  ${({ active }) => [
    !active &&
      css`
        &:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }
      `,
    active &&
      css`
        background-color: rgb(85, 84, 89);
      `,
  ]};
`;

export const TabTitle = styled.div`
  margin-left: 4px;
  margin-right: 4px;

  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  color: white;
`;

export const TabFavicon = styled.div`
  display: flex;
  margin-left: 4px;
  margin-right: 4px;
  max-width: 16px;
  max-height: 16px;

  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
`;

export const ButtonCloseTab = styled(Button)`
  padding: 4px;
`;

export const ButtonNewTab = styled(Button)`
  margin-left: 4px;
  margin-right: 4px;
  padding: 4px;
`;
