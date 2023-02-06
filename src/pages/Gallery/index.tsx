/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import clsx from 'clsx';
import AnimateHeight from 'react-animate-height';
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
import { AssetInfoType } from '@/global/types';
import { filterByName } from '@/global/utils';
import { TEMPLATE_TAGS } from '@/global/constants';

export default function GalleryPage({
  isTemplates = false,
}: {
  isTemplates: boolean;
}) {
  const searchRef = useRef<HTMLInputElement>(null);
  const authToken = useAuthToken();
  const isLoading = useIsLoading();
  const previewSelectedId = usePreviewSelectedId();
  const updatePreviewSelectedId = useUpdatePreviewSelectedId();
  const userAssets = useDisplayedAssets();
  const templateAssets = useTemplateAssets();
  const navigate = useNavigate();
  const [isTagsActved, setIsTagsActved] = useState<boolean>(false);
  const [activedTag, setActivedTag] = useState<number>(0);
  const [exportModalOpened, setExportModalOpened] = useState<boolean>(false);
  const [userImages, setUserImages] = useState<AssetInfoType[]>([]);
  const [templateImages, setTemplateImages] = useState<AssetInfoType[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [templateLoading, setTemplateLoading] = useState<boolean>(false);
  const displayedAssets = useMemo(
    () => (isTemplates ? templateImages : userImages),
    [templateImages, userImages]
  );
  const handleUpdateDisplayedAssets = useUpdateDisplayedAssets();
  const handleUpdateTemplateAssets = useUpdateTemplateAssets();

  useEffect(() => {
    handleUpdateDisplayedAssets();
    handleUpdateTemplateAssets();
  }, [authToken]);

  const handleCreate = () => {
    navigate('/editor');
  };

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const loadImages = async (images: any[]) => {
    let i = 0;
    setTemplateImages([]);
    for (const item of images) {
      if (!isTemplates) break;
      await sleep(200);
      if (i < 15) {
        setTemplateImages((p) => [...p, item]);
      } else {
        setTemplateImages((p) => [...p, ...images.slice(15)]);
        break;
      }
      i++;
    }
  };

  function search() {
    if (!searchRef.current) return;
    const result = filterByName(searchRef.current.value, templateAssets);
    console.log(result);
    setTemplateLoading(false);
    loadImages(result);
  }

  function tagSwitch(obj: any, index: number) {
    setActivedTag(index);
    const tagName = obj?.innerText;
    if (!tagName) return;
    const result = filterByName(tagName, templateAssets);
    console.log(result);
    setTemplateLoading(false);
    loadImages(result);
  }

  // function tagAll() {
  //   setTemplateLoading(false);
  //   loadImages(templateAssets);
  // }

  useEffect(() => {
    if (templateLoading) return;
    if (!isTemplates) return;
    const loadImages = async () => {
      let i = 0;
      for (const item of templateAssets) {
        if (!isTemplates) break;
        await sleep(200);
        if (i < 15) {
          setTemplateImages((p) => [...p, item]);
        } else {
          setTemplateImages((p) => [...p, ...templateAssets.slice(15)]);
          break;
        }
        i++;
      }
    };
    setTemplateLoading(true);
    loadImages();
    setTemplateLoading(false);
    // setTemplateImages([...templateAssets]);
    return () => setTemplateImages([]);
  }, [isTemplates, templateAssets]);

  useEffect(() => {
    if (userLoading) return;
    setUserImages([]);
    if (!!isTemplates) return;
    const loadImages = async () => {
      let i = 0;
      for (const item of userAssets) {
        if (!!isTemplates) break;
        await sleep(200);
        if (i < 15) {
          setUserImages((p) => [...p, item]);
        } else {
          setUserImages((p) => [...p, ...userAssets.slice(15)]);
          break;
        }
        i++;
      }
    };
    setUserLoading(true);
    loadImages();
    setUserLoading(false);
    // setUserImages([...userAssets]);
    return () => setUserImages([]);
  }, [isTemplates, userAssets]);

  return (
    <PageContainer
      heading={
        <GalleryHeading title={isTemplates ? 'Templates' : 'Projects'} />
      }
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
      {!!isTemplates && (
        <div className={styles.search}>
          <input className={styles.input} ref={searchRef} />
          <Button className={styles.button} onClick={search}>
            Search
          </Button>
          <Button
            className={isTagsActved ? styles.active_button : styles.button}
            onClick={() => setIsTagsActved((p) => !p)}
          >
            Filters
          </Button>
        </div>
      )}
      <div className={styles.gallery}>
        <AnimateHeight duration={500} height={isTagsActved ? 'auto' : 0}>
          <div className={styles.tags}>
            {TEMPLATE_TAGS.map((tag, index) => (
              <Button
                key={index}
                className={
                  index === activedTag ? styles.active_button : styles.button
                }
                onClick={(e) => tagSwitch(e.target as HTMLButtonElement, index)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </AnimateHeight>
        <div className={styles.images}>
          {displayedAssets && displayedAssets.length ? (
            isTemplates ? (
              templateImages.map((asset) => (
                <ItemWidget
                  key={asset.uid}
                  asset={asset}
                  selected={previewSelectedId === asset.uid}
                  onClick={() => updatePreviewSelectedId(asset.uid)}
                />
              ))
            ) : (
              userImages.map((asset) => (
                <ItemWidget
                  key={asset.uid}
                  asset={asset}
                  selected={previewSelectedId === asset.uid}
                  onClick={() => updatePreviewSelectedId(asset.uid)}
                />
              ))
            )
          ) : isLoading ? (
            <PropagateLoader color="#ffffff55" />
          ) : isTemplates ? (
            <div>No matched Templates</div>
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
