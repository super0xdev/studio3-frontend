import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { PinturaEditor } from '@pqina/react-pintura';
import { PinturaDefaultImageWriterResult } from '@pqina/pintura';

import styles from './index.module.scss';

import { EDITOR_CONFIG } from '@/config/editor';
import { APP_API_URL, APP_ASSET_URL } from '@/global/constants';
import {
  usePreviewSelectedAsset,
  useUpdateDisplayedAssets,
} from '@/state/gallery/hooks';
import useFetchAPI from '@/hooks/useFetchAPI';
import PageContainer from '@/components/navigation/PageContainer';
import EditorOpenPanel from '@/components/composed/editor/EditorOpenPanel';
// import WatermarkImage from '@/assets/images/watermark.png';

export default function EditorPage() {
  const fetchAPI = useFetchAPI();
  const selectedAsset = usePreviewSelectedAsset();
  const updateDisplayedAssets = useUpdateDisplayedAssets();
  const [editorSrc, setEditorSrc] = useState<string | File | undefined>(
    selectedAsset ? `${APP_ASSET_URL}${selectedAsset.file_path}` : undefined
  );
  const [editorEnabled, setEditorEnabled] = useState(!!editorSrc);

  const handleProcess = async (detail: PinturaDefaultImageWriterResult) => {
    const data = new FormData();
    data.append('image', detail.dest, (detail.src as File).name);
    if (detail.dest.size >= 10 * 1024 * 1024) {
      toast.error('The maximum upload image size is 10 MB!');
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

  const handleAssetChange = (fileSrc: string | File) => {
    setEditorEnabled(true);
    setEditorSrc(fileSrc);
  };

  const editorFileSrc = useMemo(() => {
    return typeof editorSrc === 'string'
      ? `${editorSrc}?nocache=${new Date().getTime()}`
      : editorSrc;
  }, [editorSrc]);

  return (
    <PageContainer noHeading variant={styles.editor}>
      {editorEnabled ? (
        <PinturaEditor
          onProcess={handleProcess}
          {...{ ...EDITOR_CONFIG }}
          src={editorFileSrc}
          onClose={handleEditorHide}
          onDestroy={handleEditorHide}
        />
      ) : (
        <EditorOpenPanel onChange={handleAssetChange} />
      )}
    </PageContainer>
  );
}
