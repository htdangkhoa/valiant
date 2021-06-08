import styled, { css } from 'styled-components';
import Dialog from 'renderer/components/Dialog';
import { DARK, RADIUS } from 'constants/theme';

export const MenuItems = styled(Dialog)`
  padding: 0.5rem;
  background-color: ${DARK.MAIN_COLOR};
`;

export const MenuItem = styled.li`
  padding: 0.25rem 0.5rem;
  border-radius: ${RADIUS}px;
  user-select: none;
  cursor: default;
  font-size: 14px;

  ${({ separator }) =>
    [
      separator &&
        css`
          padding: 0;
          height: 1px;
          background-color: ${DARK.SEPARATOR};
          margin: 0.5rem 0;
        `,
      !separator &&
        css`
          &:hover {
            background-color: ${DARK.HOVER_COLOR};
          }
        `,
    ].filter(Boolean)};
`;
