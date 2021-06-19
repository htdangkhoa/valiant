import styled from 'styled-components';
import Dialog from 'renderer/components/Dialog';
import { DARK, FONT_SIZES, PADDING } from 'constants/theme';
import Button from 'renderer/components/Button';

const MAX_ITEM_WIDTH = 240;

const DEFAULT_HEIGHT = 56;

export const DownloadContainer = styled(Dialog)`
  margin: 0;
  /* padding: 0.5rem; */
  border-radius: 0;
  box-shadow: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-right: 0.5rem;
`;

export const DownloadItems = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  overflow: hidden;
  max-height: ${DEFAULT_HEIGHT}px;
`;

export const DownloadItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* border-right: 1px solid red; */
  width: 235px;
  padding: 0.5rem;

  max-width: ${MAX_ITEM_WIDTH}px;
  width: 100%;

  /* :hover {
    background-color: ${DARK.HOVER_COLOR};
  } */
`;

export const ProgressBarContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Separator = styled.div`
  width: 1px;
  margin: 0.5rem 0;
  background-color: ${DARK.SEPARATOR};
`;

export const ShowAllButton = styled(Button)`
  width: auto;
  height: auto;
  padding: ${PADDING}px 8px;
  border: 1px solid ${DARK.TEXT_COLOR};
  font-size: ${FONT_SIZES.SECONDARY}px;
`;

export const DownloadInfo = styled.div`
  flex: 1;

  overflow: hidden;
  white-space: nowrap;

  div:nth-child(1) {
    font-size: ${FONT_SIZES.PRIMARY}px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  div:nth-child(2) {
    font-size: ${FONT_SIZES.SECONDARY}px;
  }
`;
