import { useState, useEffect } from 'react';
import {
  createDefaultImageReader,
  createDefaultImageScrambler,
  createDefaultImageWriter,
  createDefaultShapePreprocessor,
  PinturaDefaultImageWriterResult,
  processImage,
} from '@pqina/pintura';

import { AssetInfoType } from '@/global/types';
import { APP_ASSET_URL } from '@/global/constants';
import { loadJSON } from '@/global/utils';

export default function useProcessThumbnail(asset: AssetInfoType | null) {
  const [processedThumbnail, setProcessedThumbnail] = useState<
    PinturaDefaultImageWriterResult[]
  >([]);
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    if (!asset) return;
    const urls: File[] = [];
    asset.thumbnail_file_path.split('%').map((path) => {
      if (path == '') return;
      processImage(`${APP_ASSET_URL}${path}`, {
        imageReader: createDefaultImageReader(),
        imageWriter: createDefaultImageWriter(),
        imageScrambler: createDefaultImageScrambler(),
        shapePreprocessor: createDefaultShapePreprocessor(),
        imageState: asset.meta_file_path
          ? loadJSON(`${APP_ASSET_URL}${asset.meta_file_path}`)
          : undefined,
      }).then((res) => {
        if (res != null && !urls.includes(res?.dest)) {
          urls.push(res?.dest);
          setData([...urls.map((url) => URL.createObjectURL(url))]);
          // console.log('******', data);
        } else {
          console.log('-------', data);
        }
      });
    });
  }, [asset]);

  return {
    url: data,
  };
}
