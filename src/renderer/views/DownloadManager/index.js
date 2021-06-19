import React, { Fragment, memo, useState } from 'react';

import { ButtonIcon } from 'renderer/components/Button';
import IconClose from 'renderer/assets/svg/icon-close.svg';
import IconFile from 'renderer/assets/svg/icon-file.svg';
import IconChevronUp from 'renderer/assets/svg/icon-chevron-up.svg';

import { HIGHLIGHT_COLOR } from 'constants/theme';
import ProgressBar from './ProgressBar';
import {
  DownloadContainer,
  DownloadItems,
  DownloadItem,
  DownloadInfo,
  ProgressBarContainer,
  Separator,
  ShowAllButton,
} from './style';

const DownloadManager = () => {
  const [progress, setProgress] = useState(37);

  return (
    <DownloadContainer>
      <DownloadItems>
        {[...Array(15)].map((_, i) => (
          <Fragment key={i}>
            <DownloadItem>
              <ProgressBarContainer>
                <ProgressBar size={36} strokeWidth={3} color={HIGHLIGHT_COLOR} progress={progress} />

                <div
                  style={{
                    position: 'absolute',
                    lineHeight: 0,
                  }}>
                  <IconFile />
                </div>
              </ProgressBarContainer>

              <DownloadInfo>
                <div>tabler-icon-chevrons-down-right.svg</div>
                <div>12.3/123 MB 4 secs left</div>
              </DownloadInfo>

              <ButtonIcon src={IconChevronUp} srcSize={16} />
            </DownloadItem>

            <Separator />
          </Fragment>
        ))}
      </DownloadItems>

      <ShowAllButton>Show All</ShowAllButton>

      <ButtonIcon src={IconClose} srcSize={16} />
    </DownloadContainer>
  );
};

export default memo(DownloadManager);
