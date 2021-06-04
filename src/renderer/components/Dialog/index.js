import styled from 'styled-components';
import { DARK, DIALOG, RADIUS } from 'constants/theme';

const Dialog = styled.div`
  box-shadow: ${DIALOG.SHADOW};
  border-radius: ${RADIUS}px;
  margin: ${DIALOG.MARGIN}px;
  border: 1px solid ${DARK.MAIN_COLOR};
`;

export default Dialog;
