import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const MenuItems = styled.ul`
  padding: 0.25rem 0.5rem;
  background-color: rgb(68, 65, 76);

  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  margin: 6px;
`;

export const MenuItem = styled.li`
  padding: 0.25rem 0.5rem;
  color: white;
  border-radius: 6px;
  user-select: none;
  cursor: default;
  font-size: 14px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  ${({ separator }) =>
    [
      separator &&
        css`
          padding: 0;
          height: 1px;
          background-color: rgb(82, 81, 92);
          margin: 0.5rem 0;
        `,
    ].filter(Boolean)};
`;
