/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react';
import clsx from 'clsx';
import AllInboxSharpIcon from '@mui/icons-material/AllInboxSharp';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';

import DeleteSVG from '../../Icons/delete.svg';

import styles from './index.module.scss';

import PageContainer from '@/components/navigation/PageContainer';
import ItemWidget from '@/components/composed/gallery/ItemWidget';
import GalleryHeading from '@/components/composed/gallery/GalleryHeading';
import ExportModal from '@/components/composed/gallery/ExportModal';
import {
  useDisplayedAssets,
  useIsLoading,
  useUpdateDisplayedAssets,
  countSelected,
} from '@/state/gallery/hooks';
import { useAuthToken } from '@/state/application/hooks';
import Button from '@/components/based/Button';
import { AssetInfoType } from '@/global/types';

interface Point {
  pX: number;
  pY: number;
}

interface Selection {
  isSelected: boolean;
  position: Point;
}

export default function GalleryPage() {
  const authToken = useAuthToken();
  const isLoading = useIsLoading();
  const userAssets = useDisplayedAssets();
  const navigate = useNavigate();
  const [exportModalOpened, setExportModalOpened] = useState<boolean>(false);
  const [userImages, setUserImages] = useState<AssetInfoType[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const displayedAssets = useMemo(() => userImages, [userImages]);
  const [posBox, setPosBox] = useState<Point>({ pX: -50, pY: -50 });
  const [selectionArray, setSelectionArray] = useState<Selection[]>([]);
  const selectedCount = countSelected(selectionArray);
  const handleUpdateDisplayedAssets = useUpdateDisplayedAssets();
  useEffect(() => {
    const intervalId = setInterval(() => {
      window.location.reload();
    }, 300000);
    handleUpdateDisplayedAssets();
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
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
      const tmp: Selection[] = [];
      for (const item of userAssets) {
        // await sleep(200);
        tmp.push({ isSelected: false, position: { pX: 0, pY: 0 } });
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
      setSelectionArray(tmp);
    };
    setUserLoading(true);
    loadImages();
    setUserLoading(false);

    // setUserImages([...userAssets]);
    //return () => setUserImages([]);
  }, [userAssets]);

  const updateSelection = (event: any, index: any) => {
    const tmp = selectionArray;
    tmp[index].isSelected = !tmp[index].isSelected;
    const { top, left } = event.target.getBoundingClientRect();
    tmp[index].position.pX = left;
    tmp[index].position.pY = top;
    setSelectionArray([...tmp]);
  };

  const clearSelection = () => {
    console.log('selection clear');
    const tmp = selectionArray;
    for (let i = 0; i < tmp.length; i++) tmp[i].isSelected = false;
    setSelectionArray([...tmp]);
  };
  return (
    <PageContainer
      heading={<GalleryHeading title="Projects" />}
      onCreateMeme={handleCreate}
    >
      <ExportModal
        open={exportModalOpened}
        onClose={() => setExportModalOpened(false)}
      />
      <div className={styles.gallery}>
        <div className={styles.images}>
          {displayedAssets && displayedAssets.length ? (
            userImages.map((asset, index) => (
              <>
                <ItemWidget
                  key={`widget-user-${asset.uid}-${index}`}
                  asset={asset}
                  type={true}
                  selected={selectionArray[index].isSelected}
                  onClick={() => updateSelection(event, index)}
                />
              </>
            ))
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
      {selectedCount != 0 ? (
        <div className={styles.footer}>
          <div>({selectedCount}) items selected</div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <div className={styles.cancel} onClick={clearSelection}>
              Cancel
            </div>
            <div className={styles.delete}>
              <img src={DeleteSVG} style={{ width: '20px' }}></img>
              Delete Selected
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </PageContainer>
  );
}
