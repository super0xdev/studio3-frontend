/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import AnimateHeight from 'react-animate-height';
import AllInboxSharpIcon from '@mui/icons-material/AllInboxSharp';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';

import styles from './index.module.scss';

import { useAuth } from '@/context/AuthContext';
import PageContainer from '@/components/navigation/PageContainer';
import ItemWidget from '@/components/composed/gallery/ItemWidget';
import GalleryHeading from '@/components/composed/gallery/GalleryHeading';
import ItemPreviewDrawer from '@/components/composed/gallery/ItemPreviewDrawer';
import ExportModal from '@/components/composed/gallery/ExportModal';
import FilterPanel from '@/components/composed/gallery/FilterPanel';
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
import useFetchAPI from '@/hooks/useFetchAPI';
import Button from '@/components/based/Button';
import { AssetInfoType } from '@/global/types';
import { filterByName, filterByTags } from '@/global/utils';
import { APP_API_URL } from '@/global/constants';

export default function GalleryPage({
  isTemplates = false,
}: {
  isTemplates: boolean;
}) {
  const { isVerified } = useAuth();
  const searchRef = useRef<HTMLInputElement>(null);
  const authToken = useAuthToken();
  const isLoading = useIsLoading();
  const previewSelectedId = usePreviewSelectedId();
  const updatePreviewSelectedId = useUpdatePreviewSelectedId();
  const userAssets = useDisplayedAssets();
  const templateAssets = useTemplateAssets();
  const [taglist, setTagList] = useState<string[]>([]);
  const navigate = useNavigate();
  const [isTagsActved, setIsTagsActved] = useState<boolean>(false);
  const [exportModalOpened, setExportModalOpened] = useState<boolean>(false);
  const [userImages, setUserImages] = useState<AssetInfoType[]>([]);
  const [templateImages, setTemplateImages] = useState<AssetInfoType[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [templateLoading, setTemplateLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<boolean[]>([false]);
  const [f_tab, setFTab] = useState<string>('');
  const [f_tag, setFTag] = useState<string>('');
  const [f_collection, setFCollection] = useState<string>('');
  const displayedAssets = useMemo(
    () => (isTemplates ? templateImages : userImages),
    [templateImages, userImages]
  );
  const handleUpdateDisplayedAssets = useUpdateDisplayedAssets();
  const handleUpdateTemplateAssets = useUpdateTemplateAssets();
  const fetchAPI = useFetchAPI();
  useEffect(() => {
    fetchAPI(`${APP_API_URL}/list_tags`, 'POST').then((res) => {
      const tmp: any[] = [];
      for (let i = 0; i < res.data.length; i++) tmp[i] = res.data[i].tag;
      setTagList([...tmp]);
    });

    const intervalId = setInterval(() => {
      window.location.reload();
    }, 300000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    // if (userAssets.length == 0 || templateAssets.length == 0) {
    //   handleUpdateDisplayedAssets();
    //   handleUpdateTemplateAssets();
    // }
    if (userAssets.length == 0) handleUpdateDisplayedAssets();
    if (templateAssets.length == 0) handleUpdateTemplateAssets();
    if (!isTemplates && userAssets.length == 0) {
      handleUpdateDisplayedAssets();
      handleUpdateTemplateAssets();
    }
    if (isTemplates && templateAssets.length == 0) {
      handleUpdateTemplateAssets();
      handleUpdateDisplayedAssets();
    }
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
    const image: AssetInfoType[] = [];
    for (const item of images) {
      if (!isTemplates) break;
      await sleep(200);
      if (i < 15) {
        image.push(item);
        //setTemplateImages((p) => [...p, item]);
      } else {
        image.push(...image.slice(15));
        //setTemplateImages((p) => [...p, ...images.slice(15)]);
        break;
      }
      i++;
    }
    setTemplateImages(image);
    setTemplateLoading(false);
    //if (images.length == templateImages.length) window.location.reload();
  };

  function search() {
    if (!searchRef.current) return;
    const result = filterByName(searchRef.current.value, templateAssets);
    setTemplateLoading(false);
    console.log('result in search', result);
    loadImages(result);
  }

  function addNewTag() {
    const val = searchRef.current;
    if (!val) return;
    if (taglist.indexOf(val.value) != -1) return;
    if (val.value.length == 0) return;
    for (let i = 0; i < val.value.length; i++) {
      if (
        !(
          (val.value[i] >= 'a' && val.value[i] <= 'z') ||
          (val.value[i] >= 'A' && val.value[i] <= 'Z')
        )
      )
        return;
    }
    console.log('success');
    const data = new FormData();
    data.append('id', String(taglist.length + 1));
    data.append('tag', val.value);
    fetchAPI(`${APP_API_URL}/insert_tag`, 'POST', data, false).then((res) => {
      if (res.success) {
        toast.success('Added successfully!');
      }
    });
  }

  async function tagSwitch(obj: any, index: number) {
    const ar = tags;
    ar[index] = !ar[index];
    setTags(ar);
    //setActivedTag(index);
    //const tagName = obj?.innerText;
    //if (!tagName) return;
    const result = await filterByTags(ar, templateAssets, taglist);
    setTemplateLoading(false);
    loadImages(result);
  }

  async function handleFilters() {
    if (isTagsActved == true) {
      setTags([]);
      const result = await filterByTags([], templateAssets, taglist);
      setTemplateLoading(false);
      loadImages(result);
    }
    setIsTagsActved((p) => !p);
    const res = await fetchAPI(`${APP_API_URL}/list_tags`, 'POST');
    const tmp: any[] = [];
    for (let i = 0; i < res.data.length; i++) tmp[i] = res.data[i].tag;
    if (taglist.length != tmp.length) setTagList([...tmp]);
  }

  const onChangeFilterPanel = (filters: { [key: string]: string }) => {
    setFTag(filters['Tags']);
    setFTab(filters['Tab']);
    setFCollection(filters['Collection']);
    const ttag = filters['Tags'],
      ttab = filters['Tab'],
      tcollection = filters['Collection'];
    const filteredItems = templateAssets.filter(
      (item) =>
        (!ttag ||
          (item.tags && item.tags.toLowerCase() === ttag.toLowerCase())) &&
        (!ttab ||
          (item.tab && item.tab.toLowerCase() === ttab.toLowerCase())) &&
        (!tcollection ||
          (item.collection &&
            item.collection.toLowerCase() === tcollection.toLowerCase()))
    );
    loadImages(filteredItems);
  };
  // function tagAll() {
  //   setTemplateLoading(false);
  //   loadImages(templateAssets);
  // }

  useEffect(() => {
    if (isTemplates == false) setIsTagsActved(false);
    if (templateLoading) return;
    if (!isTemplates) return;
    if (templateImages.length > 0) setTemplateImages([]);
    const loadImages = async () => {
      let i = 0;
      const image: AssetInfoType[] = [];
      for (const item of templateAssets) {
        if (!isTemplates) break;
        await sleep(200);
        if (i < 15) {
          image.push(item);
          //setTemplateImages((p) => [...p, item]);
        } else {
          image.push(...templateAssets.slice(15));
          //setTemplateImages((p) => [...p, ...templateAssets.slice(15)]);
          break;
        }
        i++;
      }
      setTemplateImages(image);
    };
    setTemplateLoading(true);
    loadImages();
    setTemplateLoading(false);
    // setTemplateImages([...templateAssets]);
    return () => setTemplateImages([]);
  }, [isTemplates, templateAssets]);

  useEffect(() => {
    if (userLoading) return;
    if (!!isTemplates) return;
    if (userImages.length > 0) setUserImages([]);
    const loadImages = async () => {
      let i = 0;
      const image: AssetInfoType[] = [];
      for (const item of userAssets) {
        if (!!isTemplates) break;
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
  }, [isTemplates, userAssets]);

  let flag = true;
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
            // onClick={() => setIsTagsActved((p) => !p)}
            onClick={handleFilters}
          >
            Filters
          </Button>
          {isVerified == true ? (
            <Button className={styles.button} onClick={addNewTag}>
              Add a new Tag
            </Button>
          ) : (
            <></>
          )}
        </div>
      )}
      <div className={styles.gallery}>
        <AnimateHeight duration={500} height={isTagsActved ? 'auto' : 0}>
          <div className={styles.tags}>
            {taglist.map((tag, index) => (
              <Button
                key={`tag-buttons-${index}`}
                className={
                  tags[index] == true ? styles.active_button : styles.button
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
              templateImages.map((asset, index) => (
                <div
                  style={{ position: 'relative' }}
                  key={`widget-template-${index}`}
                >
                  <div style={{ position: 'absolute', top: '-80px' }}>
                    {flag && isTemplates && (
                      <FilterPanel
                        dTab={f_tab}
                        dTags={f_tag}
                        dCollection={f_collection}
                        onChangeFilter={onChangeFilterPanel}
                      ></FilterPanel>
                    )}
                  </div>
                  <ItemWidget
                    asset={asset}
                    selected={previewSelectedId === asset.uid}
                    onClick={() => updatePreviewSelectedId(asset.uid)}
                  />
                  {(flag = false)}
                </div>
              ))
            ) : (
              userImages.map((asset) => (
                <ItemWidget
                  key={`widget-user-${asset.uid}`}
                  asset={asset}
                  selected={previewSelectedId === asset.uid}
                  onClick={() => updatePreviewSelectedId(asset.uid)}
                />
              ))
            )
          ) : isLoading ? (
            <PropagateLoader color="#ffffff55" />
          ) : isTemplates ? (
            <div style={{ position: 'relative' }}>
              <div
                style={{ position: 'absolute', top: '-80px', left: '-140px' }}
              >
                <FilterPanel
                  dTab={f_tab}
                  dTags={f_tag}
                  dCollection={f_collection}
                  onChangeFilter={onChangeFilterPanel}
                ></FilterPanel>
              </div>
              <br></br>
              {templateLoading ? (
                <PropagateLoader color="#ffffff55" />
              ) : (
                <>No matched Templates</>
              )}
            </div>
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
