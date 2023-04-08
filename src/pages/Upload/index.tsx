import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { Card, CircularProgress, TextField } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import UploadIcon from '@mui/icons-material/Upload';

import styles from './index.module.scss';

import PageContainer from '@/components/navigation/PageContainer';
import Button from '@/components/based/Button';
import { APP_API_URL } from '@/global/constants';
import useFetchAPI from '@/hooks/useFetchAPI';
import GalleryHeading from '@/components/composed/gallery/GalleryHeading';

export default function UploadPage() {
  const [image, setImage] = useState<any>();
  const [imageURL, setImageURL] = useState<string>();
  const [tab, setTab] = useState<string>('');
  const [collection, setCollection] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [categories, setCategories] = useState<any>({
    tab: [],
    collection: [],
    tags: [],
  });
  const fetchAPI = useFetchAPI();

  const onImageChange = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error('Please select image to upload');
      return;
    }
    const data = new FormData();
    const imageFile = image as File;
    if (imageFile.size >= 10 * 1024 * 1024) {
      toast.error('The maximum upload image size is 10 MB!');
      return;
    }
    console.log(imageFile);

    data.append('image', image as Blob, imageFile.name);
    data.append('tab', tab);
    data.append('collection', collection);
    data.append('tags', tags);
    console.log(data);
    const toastLoadingID = toast.loading('Saving...');

    fetchAPI(`${APP_API_URL}/upload_template_asset`, 'POST', data, false).then(
      (res) => {
        toast.dismiss(toastLoadingID);

        if (res.success) {
          toast.success('Saved successfully!');
        }
      }
    );
  };

  // const handleTest = async () => {
  //   const data = new FormData();
  //   data.append('tab', '');
  //   data.append('collection', 'b');
  //   data.append('tags', '');

  //   fetchAPI(
  //     `${APP_API_URL}/list_template_assets_by_category`,
  //     'POST',
  //     data,
  //     false
  //   ).then((res) => {
  //     console.log(res.data);
  //     if (res.success) {
  //       toast.success('Saved successfully!');
  //     }
  //   });
  // };

  // useEffect(() => {
  //   if (images.length < 1) return;
  //   const newImageUrls: string[] = [];
  //   images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
  //   setImageURLs(newImageUrls);
  // }, [images]);

  useEffect(() => {
    if (!image) return;
    setImageURL(URL.createObjectURL(image));
  }, [image]);

  useEffect(() => {
    fetchAPI(`${APP_API_URL}/get_categories`, 'POST').then((res) => {
      if (res.data) setCategories({ ...res.data });
    });
  }, []);

  return (
    <PageContainer
      heading={<GalleryHeading title={'Upload'} />}
      variant={styles.editor}
    >
      <div className={styles.gallery}>
        <div className={styles.images}>
          <div className={styles.placeholder}>
            <div className={styles.description}>
              Upload a new image to get started!
            </div>
            <input
              id="upload"
              style={{ display: 'none' }}
              type="file"
              // multiple
              accept="image/*"
              onChange={onImageChange}
            />
            <Button className={styles.create}>
              <label className={styles.btnLabel} htmlFor="upload">
                <AddSharpIcon /> Open image file
              </label>
            </Button>

            {image && (
              <div className={styles.images}>
                <Card className={styles.widget}>
                  <div className={styles.imageWrapper}>
                    {imageURL ? (
                      <LazyLoadImage src={imageURL} effect="blur" />
                    ) : (
                      <CircularProgress />
                    )}
                  </div>
                  <div className={styles.infoContainer}>
                    <div className={styles.title}>{''}</div>
                  </div>
                </Card>
              </div>
            )}

            <div className={styles.features}>
              <div className={styles.list}>
                <div>Tab</div>
                <input value={tab} onChange={(e) => setTab(e.target.value)} />
                <select onChange={(e) => setTab(e.target.value)}>
                  <option>-- NONE --</option>
                  {categories.tab?.map((item: string) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.list}>
                <div>Collection</div>
                <input
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                />
                <select onChange={(e) => setCollection(e.target.value)}>
                  <option>-- NONE --</option>
                  {categories.collection?.map((item: string) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.list}>
                <div>Tags</div>
                <input value={tags} onChange={(e) => setTags(e.target.value)} />
                <select onChange={(e) => setTags(e.target.value)}>
                  <option>-- NONE --</option>
                  {categories.tags?.map((item: string) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button className={styles.create} onClick={handleUpload}>
              <UploadIcon /> Upload
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
