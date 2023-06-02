import React, { FC } from 'react';
import clsx from 'clsx';
import { Card } from '@mui/material';
// import { filesize } from 'filesize';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';

import CheckSVG from '../../../../Icons/check.svg';
import CheckedSVG from '../../../../Icons/checked.svg';
import OptionSVG from '../../../../Icons/option.svg';

import styles from './index.module.scss';

import { AssetInfoType } from '@/global/types';
import { splitFileName } from '@/global/utils';
import CircularProgress from '@/components/based/CircularProgress';
import useProcessThumbnail from '@/hooks/useProcessThumbnail';

interface IItemWidget {
  title?: string;
  type: boolean;
  asset: AssetInfoType;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const ItemWidget: FC<IItemWidget> = ({
  type,
  selected,
  asset,
  onClick,
  onDoubleClick,
}) => {
  const { url: processedImg } = useProcessThumbnail(asset);
  return (
    <div className={styles.card}>
      {type == true ? (
        selected == true ? (
          <img className={styles.checked} src={CheckedSVG} />
        ) : (
          <>
            <img className={styles.check} src={CheckSVG} />
            <img className={styles.option} src={OptionSVG} />
          </>
        )
      ) : (
        <></>
      )}

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
    </div>
  );
};

export default ItemWidget;
