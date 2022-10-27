import React, { FC, useState } from 'react';
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
  // FileCopySharp,
  // ShareSharp,
} from '@mui/icons-material';
import { filesize } from 'filesize';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import EditModal from '../EditModal';

import styles from './index.module.scss';

import IconButton from '@/components/based/IconButton';
import {
  usePreviewSelectedAsset,
  useUpdateDisplayedAssets,
} from '@/state/gallery/hooks';
import { APP_API_URL, APP_ASSET_URL } from '@/global/constants';
import useFetchAPI from '@/hooks/useFetchAPI';
import {
  useAppendOpenedAsset,
  useRemoveOpenedAsset,
} from '@/state/application/hooks';

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
  const [editModalOpend, setEditModalOpened] = useState(false);

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
    if (!asset) return;
    fetchAPI(
      `${APP_API_URL}/download_asset`,
      'POST',
      {
        file_path: `${asset.file_path}`,
      },
      true,
      false
    ).then((res) => {
      saveAs(res, asset.file_name);
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
          {!!asset && (
            <LazyLoadImage
              src={`${APP_ASSET_URL}${asset.file_path}`}
              effect="blur"
            />
          )}
        </div>
        <div className={styles.title}>{!!asset && asset.file_name}</div>
        <div className={styles.meta}>
          {!!asset && filesize(asset.file_size_bytes).toString()}
        </div>
      </section>
      <section className={styles.details}>
        <div className={styles.label}>Information</div>
        <div className={styles.row}>
          Created:{' '}
          {!!asset && (
            <b>{new Date(asset.creation_timestamp * 1000).toLocaleString()}</b>
          )}
        </div>
        <div className={styles.row}>
          Confirmed:{' '}
          {!!asset && (
            <b>
              {asset.confirmation_timestamp
                ? new Date(asset.confirmation_timestamp * 1000).toLocaleString()
                : '-'}
            </b>
          )}
        </div>
        <div className={styles.row}>
          Creator:{' '}
          {!!asset && (
            <b>
              {asset.user_uid}{' '}
              <IconButton size="small" className={styles.openInNew}>
                <OpenInNewSharpIcon />
              </IconButton>
            </b>
          )}
        </div>
        {/* <div className={styles.row}>
          Tags: <b>Hello, World, Solana</b>
        </div> */}
      </section>
      <section className={styles.actions}>
        <div className={styles.button} onClick={() => setEditModalOpened(true)}>
          <IconButton>
            <InfoSharp />
          </IconButton>
          Info
        </div>
        <div className={styles.button} onClick={handleEdit}>
          <IconButton>
            <EditSharp />
          </IconButton>
          Edit
        </div>
        {/* <div className={styles.button}>
          <IconButton>
            <FileCopySharp />
          </IconButton>
          Dupplicate
        </div> */}
        <div className={styles.button} onClick={handleDownload}>
          <IconButton>
            <FileDownloadSharp />
          </IconButton>
          Download
        </div>
        <div className={styles.button} onClick={handleDelete}>
          <IconButton>
            <DeleteSharp />
          </IconButton>
          Delete
        </div>
      </section>
    </div>
  );
};

export default ItemPreviewDrawer;
