/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react';
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
  useIsLoading,
  usePreviewSelectedId,
  useUpdateDisplayedAssets,
  useUpdatePreviewSelectedId,
} from '@/state/gallery/hooks';
import { useAuthToken } from '@/state/application/hooks';
import Button from '@/components/based/Button';
import { AssetInfoType } from '@/global/types';

export default function GalleryPage() {
  const authToken = useAuthToken();
  const isLoading = useIsLoading();
  const previewSelectedId = usePreviewSelectedId();
  const updatePreviewSelectedId = useUpdatePreviewSelectedId();
  const userAssets = useDisplayedAssets();
  const navigate = useNavigate();
  const [exportModalOpened, setExportModalOpened] = useState<boolean>(false);
  const [userImages, setUserImages] = useState<AssetInfoType[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const displayedAssets = useMemo(() => userImages, [userImages]);
  const handleUpdateDisplayedAssets = useUpdateDisplayedAssets();
  useEffect(() => {
    const intervalId = setInterval(() => {
      window.location.reload();
    }, 300000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (userAssets.length == 0 || userAssets.length != userImages.length)
      handleUpdateDisplayedAssets();
  }, [authToken]);

  const handleCreate = () => {
    navigate('/editor');
  };

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // function tagAll() {
  //   setTemplateLoading(false);
  //   loadImages(templateAssets);
  // }

  useEffect(() => {
    if (userLoading) return;
    if (userImages.length > 0) setUserImages([]);
    const loadImages = async () => {
      let i = 0;
      const image: AssetInfoType[] = [];
      for (const item of userAssets) {
        await sleep(200);
        if (i < 15) {
          image.push(item);
          //setUserImages((p) => [...p, item]);
        } else {
          image.push(...userAssets.slice(15));
          //setUserImages((p) => [...p, ...userAssets.slice(15)]);
          break;
        }
        i++;
      }
      setUserImages(image);
    };
    setUserLoading(true);
    loadImages();
    setUserLoading(false);
    // setUserImages([...userAssets]);
    //return () => setUserImages([]);
  }, [userAssets]);

  return (
    <PageContainer
      heading={<GalleryHeading title="Projects" />}
      variant={clsx({ [styles.opened]: !!previewSelectedId })}
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
      <div className={styles.gallery}>
        <div className={styles.images}>
          {displayedAssets && displayedAssets.length ? (
            userImages.map((asset) => (
              <ItemWidget
                key={`widget-user-${asset.uid}`}
                asset={asset}
                selected={previewSelectedId === asset.uid}
                onClick={() => updatePreviewSelectedId(asset.uid)}
              />
            ))
          ) : isLoading || userAssets.length != 0 ? (
            <PropagateLoader color="#ffffff55" />
          ) : (
            <div className={styles.placeholder}>
              <AllInboxSharpIcon className={styles.icon} />
              <div className={styles.title}>
                You don’t have any designs yet.
              </div>
              <div className={styles.description}>
                Create a new one to get started!
              </div>
              <Button className={styles.create} onClick={handleCreate}>
                <AddSharpIcon /> Create a design
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
