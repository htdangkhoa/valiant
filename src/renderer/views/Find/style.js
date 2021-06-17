import styled from 'styled-components';
import Dialog from 'renderer/components/Dialog';
import { DARK, FONT_SIZES } from 'constants/theme';

export const DialogContainer = styled(Dialog)`
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
  padding: 0.5rem;
  flex: 1;
`;

export const Input = styled.input`
  color: ${DARK.TEXT_COLOR};
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
`;

export const Label = styled.label`
  font-size: ${FONT_SIZES.SECONDARY}px;
  margin: auto;
`;

export const Separator = styled.div`
  width: 1px;
  background-color: ${DARK.SEPARATOR};
`;
