import { DARK, FONT_SIZES } from 'constants/theme';
import Dialog from 'renderer/components/Dialog';
import styled from 'styled-components';

export const TabPreviewContainer = styled(Dialog)`
  line-height: 0;
  border: 1px solid ${DARK.SEPARATOR};
`;

export const TabTitle = styled.div`
  padding: 0.5rem;
  line-height: 1.5;
  font-size: ${FONT_SIZES.PRIMARY}px;
  font-weight: bold;

  p {
    color: ${DARK.TEXT_COLOR};
    -webkit-line-clamp: 2;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    word-break: break-all;
    margin: 0;
  }

  label {
    color: ${DARK.TEXT_COLOR_SECONDARY};
    font-size: ${FONT_SIZES.SECONDARY}px;
    font-weight: normal;
  }
`;

export const ImagePreview = styled.img`
  width: 100%;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;
