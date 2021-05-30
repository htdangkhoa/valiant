import React, { memo } from 'react';
import { SuggestionContainer } from './style';

const Suggestion = () => (
  <SuggestionContainer>
    <div>Hello world</div>
  </SuggestionContainer>
);

export default memo(Suggestion);
