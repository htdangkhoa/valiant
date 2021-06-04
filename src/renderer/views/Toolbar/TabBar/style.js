import styled, { css } from 'styled-components';
import { DARK, PADDING, RADIUS } from 'constants/theme';
import Button from 'renderer/components/Button';

export const TabContainer = styled.div`
  display: flex;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 7.5rem;
  padding-right: 5.5rem;
  -webkit-app-region: drag;
  background-color: ${DARK.TITLE_BAR};

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
  border-radius: ${RADIUS}px;
  min-width: 100px;
  padding: ${PADDING}px;
  max-width: 18em;
  width: 100vw;
  font-size: 0.75rem;
  position: relative;
  background-color: ${DARK.TAB_COLOR};
  display: flex;
  align-items: center;

  ${({ active, animationSize, zIndex }) => [
    !active &&
      css`
        &:hover {
          background-color: ${DARK.TAB_HOVER};
        }
      `,
    active &&
      css`
        background-color: ${DARK.TAB_ACTIVE};
      `,

    css`
      @keyframes slide-in {
        0% {
          left: -${animationSize || 100}px;
        }
        100% {
          left: 0;
        }
      }

      animation: slide-in 0.2s;
      z-index: ${zIndex};
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
  color: ${DARK.TEXT_COLOR};
  pointer-events: none;
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
  pointer-events: none;
`;

export const ButtonCloseTab = styled(Button)`
  padding: 4px;
`;

export const ButtonNewTab = styled(Button)`
  margin-left: 4px;
  margin-right: 4px;
  padding: 4px;
`;
