import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Card, Grid } from '@mui/material';
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
          <Grid
            sx={{
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {processedImg.map((item, index) => (
              <LazyLoadImage key={index} src={item} effect="blur" />
            ))}
          </Grid>
        ) : (
          <CircularProgress />
        )}
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.title} style={{ textAlign: 'center' }}>
          {asset.file_name.includes('%') ? (
            <div>
              <div>Multiple Images</div>
              {asset.file_name
                .split('%')
                .map((item) => (item != '' ? <div>{item}</div> : <></>))}
            </div>
          ) : (
            asset.file_name
          )}
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
