import styled, { css } from 'styled-components';
import Dialog from 'renderer/components/Dialog';
import { DARK, FONT_SIZES, RADIUS } from 'constants/theme';

export const MenuItems = styled(Dialog)`
  padding: 0.5rem;
`;

export const MenuItem = styled.li`
  padding: 0.25rem 0.5rem;
  border-radius: ${RADIUS}px;
  user-select: none;
  cursor: default;
  font-size: ${FONT_SIZES.PRIMARY}px;

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
