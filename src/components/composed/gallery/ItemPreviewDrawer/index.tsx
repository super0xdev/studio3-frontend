import React, { FC, useMemo, useState } from 'react';
import clsx from 'clsx';
import { saveAs } from 'file-saver';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import ArticleSharpIcon from '@mui/icons-material/ArticleSharp';
import OpenInNewSharpIcon from '@mui/icons-material/OpenInNewSharp';
import {
  EditSharp,
  FileDownloadSharp,
  DeleteSharp,
  InfoSharp,
  // ShoppingCartSharp,
  FileCopySharp,
  // ShareSharp,
} from '@mui/icons-material';
import { filesize } from 'filesize';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import EditModal from '../EditModal';

import styles from './index.module.scss';

import CircularProgress from '@/components/based/CircularProgress';
import IconButton from '@/components/based/IconButton';
import {
  usePreviewSelectedAsset,
  useUpdateDisplayedAssets,
} from '@/state/gallery/hooks';
import { APP_API_URL, TEMPLATE_USER_ID } from '@/global/constants';
import useFetchAPI from '@/hooks/useFetchAPI';
import {
  useAppendOpenedAsset,
  useRemoveOpenedAsset,
} from '@/state/application/hooks';
import useProcessImage from '@/hooks/useProcessImage';
// import usePurchaseAsset from '@/hooks/usePurchaseAsset';

interface IItemPreviewDrawer {
  id?: string;
  open: boolean;
  onClose: () => void;
}

const ItemPreviewDrawer: FC<IItemPreviewDrawer> = ({ open, onClose }) => {
  const asset = usePreviewSelectedAsset();
  const navigate = useNavigate();
  const fetchAPI = useFetchAPI();
  const handleUpdateDisplayedAssets = useUpdateDisplayedAssets();
  const appendOpenedAsset = useAppendOpenedAsset();
  const removeOpenedAsset = useRemoveOpenedAsset();
  // const purchaseAsset = usePurchaseAsset();
  const [editModalOpend, setEditModalOpened] = useState(false);
  const { url: processedImageUrl, content: processedImageContent } =
    useProcessImage(asset);

  const isTemplateAsset = useMemo(() => {
    return asset?.user_uid === TEMPLATE_USER_ID;
  }, [asset]);

  const handleEdit = () => {
    if (asset) {
      navigate('/editor');
      appendOpenedAsset(asset.uid);
    }
  };

  const handleDelete = () => {
    if (!asset) return;
    fetchAPI(
      `${APP_API_URL}/delete_asset`,
      'POST',
      {
        asset_uid: asset.uid,
        file_key: asset.file_path,
      },
      true
    ).then((res) => {
      if (res.success) {
        toast.success('Deleted successfully!');
        handleUpdateDisplayedAssets();
        removeOpenedAsset(asset.uid);
        onClose();
      }
    });
  };

  const handleDownload = () => {
    if (!processedImageContent || !asset) return;
    const data = new FormData();

    data.append('image', processedImageContent, asset.file_name);

    fetchAPI(`${APP_API_URL}/export_asset`, 'POST', data, false, false).then(
      (res) => {
        saveAs(res, asset.file_name);
      }
    );
  };

  // const handlePurchase = async () => {
  //   const tx = await purchaseAsset();
  //   console.log(tx);
  // };

  const handleDuplicate = () => {
    if (!asset) return;
    fetchAPI(`${APP_API_URL}/duplicate_multi_asset`, 'POST', {
      asset_uid: asset.uid,
    }).then((res) => {
      if (res.success) {
        toast.success(
          isTemplateAsset
            ? 'Added Template to Projects!'
            : 'Duplicated successfully!'
        );
        if (isTemplateAsset) navigate('/gallery');
        handleUpdateDisplayedAssets();
        onClose();
      }
    });
  };

  return (
    <div className={clsx(styles.drawer, { [styles.opened]: open })}>
      <IconButton size="small" className={styles.close} onClick={onClose}>
        <CloseSharpIcon />
      </IconButton>
      <EditModal
        open={editModalOpend}
        onClose={() => setEditModalOpened(false)}
      />
      <section className={styles.heading}>
        <ArticleSharpIcon /> Design Preview
      </section>
      <section className={styles.content}>
        <div className={styles.imageWrapper}>
          {processedImageUrl ? (
            <LazyLoadImage src={processedImageUrl} effect="blur" />
          ) : (
            <CircularProgress />
          )}
        </div>
        <div className={styles.title}>{!!asset && asset.file_name}</div>
        {/* <div className={styles.meta}>
          {!!asset && filesize(asset.file_size_bytes).toString()}
        </div> */}
      </section>
      <section className={styles.details}>
        <div className={styles.label}>Information</div>
        <div className={styles.row}>
          Date Created:{' '}
          {!!asset && (
            <b>{new Date(asset.creation_timestamp * 1000).toLocaleString()}</b>
          )}
        </div>
        <div className={styles.row}>
          Last Modified:{' '}
          {!!asset && (
            <b>{new Date(asset.update_timestamp * 1000).toLocaleString()}</b>
          )}
        </div>
        {/* The user doesn't need this info */}
        {/* <div className={styles.row}>
          Confirmed:{' '}
          {!!asset && (
            <b>
              {asset.confirmation_timestamp
                ? new Date(asset.confirmation_timestamp * 1000).toLocaleString()
                : '-'}
            </b>
          )}
        </div> */}
        {/* <div className={styles.row}>
          Creator:{' '}
          {!!asset && !isTemplateAsset && (
            <b>
              {asset.user_uid}{' '}
              <IconButton size="small" className={styles.openInNew}>
                <OpenInNewSharpIcon />
              </IconButton>
            </b>
          )}
          {!!asset && isTemplateAsset && <b>studio³</b>}
        </div> */}
        <div className={styles.row}>
          File Size:{' '}
          {!!asset && <b>{filesize(asset.file_size_bytes).toString()}</b>}
        </div>
        <div className={styles.row}>
          File Type: {!!asset && <b>{asset.file_type.toUpperCase()}</b>}
        </div>
        {/* <div className={styles.row}>
          Tags: <b>Hello, World, Solana</b>
        </div> */}
      </section>
      <section className={styles.actions}>
        {/* This will go in the export modal when it's ready */}
        {/* <div className={styles.button} onClick={handlePurchase}>
          <IconButton>
            <ShoppingCartSharp />
          </IconButton>
          Purchase
        </div> */}
        {!isTemplateAsset && (
          <div className={styles.button} onClick={handleEdit}>
            <IconButton>
              <EditSharp />
            </IconButton>
            Edit
          </div>
        )}
        {!isTemplateAsset && (
          <div className={styles.button} onClick={handleDownload}>
            <IconButton>
              <FileDownloadSharp />
            </IconButton>
            Download
          </div>
        )}
        <div className={styles.button} onClick={handleDuplicate}>
          <IconButton>
            <FileCopySharp />
          </IconButton>
          {isTemplateAsset ? 'Add to Projects' : 'Duplicate'}
        </div>
        {!isTemplateAsset && (
          <div
            className={styles.button}
            onClick={() => setEditModalOpened(true)}
          >
            <IconButton>
              <InfoSharp />
            </IconButton>
            Info
          </div>
        )}
        {!isTemplateAsset && (
          <div className={styles.button} onClick={handleDelete}>
            <IconButton>
              <DeleteSharp />
            </IconButton>
            Delete
          </div>
        )}
      </section>
    </div>
  );
};

export default ItemPreviewDrawer;
