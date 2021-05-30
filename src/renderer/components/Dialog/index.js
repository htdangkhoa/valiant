import styled from '@emotion/styled';
import { DIALOG_MARGIN } from 'constants/theme';

const Dialog = styled.div`
  box-shadow: 0 3px ${DIALOG_MARGIN}px rgba(0, 0, 0, 0.16), 0 3px ${DIALOG_MARGIN}px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  margin: ${DIALOG_MARGIN}px;
`;

export default Dialog;
