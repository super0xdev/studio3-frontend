/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import AllInboxSharpIcon from '@mui/icons-material/AllInboxSharp';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';

import styles from './index.module.scss';

import PageContainer from '@/components/navigation/PageContainer';
import ItemWidget from '@/components/composed/gallery/ItemWidget';
import GalleryHeading from '@/components/composed/gallery/GalleryHeading';
import ItemPreviewDrawer from '@/components/composed/gallery/ItemPreviewDrawer';
import ExportModal from '@/components/composed/gallery/ExportModal';
import {
  useDisplayedAssets,
  useTemplateAssets,
  useIsLoading,
  usePreviewSelectedId,
  useUpdateDisplayedAssets,
  useUpdateTemplateAssets,
  useUpdatePreviewSelectedId,
} from '@/state/gallery/hooks';
import { useAuthToken } from '@/state/application/hooks';
import Button from '@/components/based/Button';

export default function GalleryPage({
  isTemplates = false,
}: {
  isTemplates: boolean;
}) {
  const authToken = useAuthToken();
  const isLoading = useIsLoading();
  const previewSelectedId = usePreviewSelectedId();
  const updatePreviewSelectedId = useUpdatePreviewSelectedId();
  const userAssets = useDisplayedAssets();
  const templateAssets = useTemplateAssets();
  const displayedAssets = isTemplates ? templateAssets : userAssets;
  const navigate = useNavigate();
  const [exportModalOpened, setExportModalOpened] = useState<boolean>(false);

  const handleUpdateDisplayedAssets = useUpdateDisplayedAssets();
  const handleUpdateTemplateAssets = useUpdateTemplateAssets();

  useEffect(() => {
    handleUpdateDisplayedAssets();
    handleUpdateTemplateAssets();
  }, [authToken]);

  const handleCreate = () => {
    navigate('/editor');
  };

  return (
    <PageContainer
      heading={
        <GalleryHeading title={isTemplates ? 'Templates' : 'Projects'} />
      }
      variant={clsx(styles.gallery, { [styles.opened]: !!previewSelectedId })}
    >
      <ExportModal
        open={exportModalOpened}
        onClose={() => setExportModalOpened(false)}
      />
      <ItemPreviewDrawer
        open={!!previewSelectedId}
        onClose={() =>
          previewSelectedId && updatePreviewSelectedId(previewSelectedId)
        }
      />
      {displayedAssets && displayedAssets.length ? (
        displayedAssets.map((asset) => (
          <ItemWidget
            key={asset.uid}
            asset={asset}
            selected={previewSelectedId === asset.uid}
            onClick={() => updatePreviewSelectedId(asset.uid)}
          />
        ))
      ) : isLoading ? (
        <PropagateLoader color="#ffffff55" />
      ) : (
        <div className={styles.placeholder}>
          <AllInboxSharpIcon className={styles.icon} />
          <div className={styles.title}>You don’t have any designs yet.</div>
          <div className={styles.description}>
            Create a new one to get started!
          </div>
          <Button className={styles.create} onClick={handleCreate}>
            <AddSharpIcon /> Create a design
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
