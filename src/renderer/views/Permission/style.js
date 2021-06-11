import styled from 'styled-components';
import Dialog from 'renderer/components/Dialog';
import Button from 'renderer/components/Button';
import { DARK, PADDING } from 'constants/theme';

export const PermissionContainer = styled(Dialog)`
  padding: 0.5rem;
`;

export const Title = styled.div`
  word-break: break-word;
  line-height: 1;
`;

export const Description = styled(Title)`
  word-break: break-word;
  font-size: 12px;
  display: flex;
  align-items: center;
  margin: 0.5rem 0;

  svg {
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
  }

  div {
    margin-left: 0.5rem;
  }
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const RequestButton = styled(Button)`
  width: auto;
  height: auto;
  padding: ${PADDING}px 8px;
  border: 1px solid ${DARK.TEXT_COLOR};
`;
