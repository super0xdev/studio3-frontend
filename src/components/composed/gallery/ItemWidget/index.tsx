import React, { FC } from 'react';
import clsx from 'clsx';
import { Card } from '@mui/material';
// import { filesize } from 'filesize';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';

import styles from './index.module.scss';

import { AssetInfoType } from '@/global/types';
import { splitFileName } from '@/global/utils';
import CircularProgress from '@/components/based/CircularProgress';
import useProcessThumbnail from '@/hooks/useProcessThumbnail';

interface IItemWidget {
  title?: string;
  asset: AssetInfoType;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const ItemWidget: FC<IItemWidget> = ({
  selected,
  asset,
  onClick,
  onDoubleClick,
}) => {
  const { url: processedImg } = useProcessThumbnail(asset);
  return (
    <Card
      className={clsx(styles.widget, { [styles.selected]: selected })}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className={styles.imageWrapper}>
        {processedImg ? (
          <LazyLoadImage src={processedImg} effect="blur" />
        ) : (
          <CircularProgress />
        )}
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.title}>
          {splitFileName(asset.file_name)[0] || asset.file_name}
        </div>
        {/* <div className={styles.info}>
          <div className={styles.meta}>
            <div className={styles.row}>
              <b>Date modified:</b>
              {` ${new Date(asset.creation_timestamp * 1000).toLocaleString()}`}
            </div>
          </div>
          <AccountCircleSharpIcon className={styles.avatar} />
        </div> */}
      </div>
    </Card>
  );
};

export default ItemWidget;
