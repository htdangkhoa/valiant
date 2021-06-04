import styled, { css } from 'styled-components';
import Dialog from 'renderer/components/Dialog';
import { DARK } from 'constants/theme';

export const SuggestionContainer = styled(Dialog)`
  background-color: red;
  border-radius: 4px;
  padding: 0.25rem 0;
  line-height: 0;
  background-color: ${DARK.MAIN_COLOR};
`;

export const Input = styled.input`
  outline: none;
  border: none;
  width: 100%;
  height: auto;
  padding: 0.25rem 0.5rem;
  line-height: 1;
  background-color: transparent;
  color: white;
`;

export const SuggestionItems = styled.div``;

export const SuggestionItem = styled.div`
  margin: 0.225rem 0.45rem;
  padding: 0.45rem 0.35rem;
  color: white;
  line-height: 1;
  border-radius: 4px;
  display: flex;
  align-items: center;

  div:first-of-type {
    margin-right: 0.35rem;
  }

  &:hover {
    background-color: ${DARK.HOVER_COLOR};
  }

  ${({ willSelect }) =>
    [
      willSelect &&
        css`
          background-color: ${DARK.HOVER_COLOR};
        `,
    ].filter(Boolean)}
`;
