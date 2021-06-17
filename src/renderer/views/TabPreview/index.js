import { ipcRenderer } from 'electron';
import React, { memo, useEffect, useState } from 'react';
import { TabPreviewContainer, TabTitle, ImagePreview } from './style';

const TabPreView = () => {
  const [dataPreview, setDataPreview] = useState({
    title: undefined,
    hostname: undefined,
    image: undefined,
  });

  useEffect(() => {
    const dialogId = ipcRenderer.sendSync('get-webcontents-id');

    const data = ipcRenderer.sendSync(`tab-data-preview-${dialogId}`);

    setDataPreview(data);
  }, []);

  return (
    <TabPreviewContainer>
      <TabTitle>
        <p>{dataPreview.title}</p>
        {!!dataPreview.hostname && <label>{dataPreview.hostname}</label>}
      </TabTitle>

      {typeof dataPreview.image === 'string' && <ImagePreview src={dataPreview.image} />}
    </TabPreviewContainer>
  );
};

export default memo(TabPreView);
