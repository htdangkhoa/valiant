import styled from 'styled-components';
import Dialog from 'renderer/components/Dialog';

export const SuggestionContainer = styled(Dialog)`
  background-color: red;
  padding: 0.25rem 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

export const SuggestionItem = styled.div`
  padding: 0.25rem 0.5rem;
  background-color: red;
  cursor: pointer;

  &:hover {
    background-color: blue;
  }
`;
