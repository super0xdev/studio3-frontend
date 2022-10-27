import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { PinturaEditor } from '@pqina/react-pintura';
import { PinturaDefaultImageWriterResult } from '@pqina/pintura';

import styles from './index.module.scss';

import { EDITOR_CONFIG } from '@/config/editor';
import PageContainer from '@/components/navigation/PageContainer';
import { APP_API_URL, APP_ASSET_URL } from '@/global/constants';
import {
  usePreviewSelectedAsset,
  useUpdateDisplayedAssets,
} from '@/state/gallery/hooks';
import useFetchAPI from '@/hooks/useFetchAPI';
import EditorOpenPanel from '@/components/composed/editor/EditorOpenPanel';

export default function EditorPage() {
  const fetchAPI = useFetchAPI();
  const selectedAsset = usePreviewSelectedAsset();
  const updateDisplayedAssets = useUpdateDisplayedAssets();
  const [editorSrc, setEditorSrc] = useState<string | undefined>(
    selectedAsset ? `${APP_ASSET_URL}${selectedAsset.file_path}` : undefined
  );
  const [editorEnabled, setEditorEnabled] = useState(!!editorSrc);

  const handleProcess = async (detail: PinturaDefaultImageWriterResult) => {
    const data = new FormData();
    data.append('image', detail.dest, (detail.src as File).name);
    if (detail.dest.size >= 5 * 1024 * 1024) {
      toast.error('The maximum upload image size is 5 MB!');
      return;
    }
    if (selectedAsset) {
      data.append('asset_uid', selectedAsset.uid.toString());
      data.append('file_key', selectedAsset.file_path);
    }

    fetchAPI(
      `${APP_API_URL}/${selectedAsset ? 'overwrite_asset' : 'upload_asset'}`,
      'POST',
      data,
      false
    ).then((res) => {
      if (res.success) {
        toast.success('Saved successfully!');
        updateDisplayedAssets();
      }
    });
  };

  const handleEditorHide = () => setEditorEnabled(false);

  const handleAssetChange = (fileSrc: string) => {
    setEditorEnabled(true);
    setEditorSrc(fileSrc);
  };

  return (
    <PageContainer noHeading variant={styles.editor}>
      {editorEnabled ? (
        <PinturaEditor
          onProcess={handleProcess}
          {...{ ...EDITOR_CONFIG }}
          src={editorSrc}
          onClose={handleEditorHide}
          onDestroy={handleEditorHide}
        />
      ) : (
        <EditorOpenPanel onChange={handleAssetChange} />
      )}
    </PageContainer>
  );
}
