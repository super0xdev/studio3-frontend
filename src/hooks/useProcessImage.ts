import { useEffect, useState } from 'react';
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

export default function useProcessImage(asset: AssetInfoType | null) {
  const [processedImage, setProcessedImage] =
    useState<PinturaDefaultImageWriterResult>();

  useEffect(() => {
    if (!asset) return;
    processImage(`${APP_ASSET_URL}${asset.file_path}`, {
      imageReader: createDefaultImageReader(),
      imageWriter: createDefaultImageWriter(),
      imageScrambler: createDefaultImageScrambler(),
      shapePreprocessor: createDefaultShapePreprocessor(),
      imageState: asset.meta_file_path
        ? loadJSON(`${APP_ASSET_URL}${asset.meta_file_path}`)
        : undefined,
    }).then((res) => {
      setProcessedImage(res);
    });
  }, [asset]);

  return {
    url: processedImage
      ? URL.createObjectURL(processedImage?.dest as Blob)
      : null,
    content: processedImage?.dest as Blob,
  };
}
