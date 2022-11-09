/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from 'react-redux';

import { useUpdateOpenedAssets } from '../application/hooks';

import {
  updateDisplayedAssets,
  updateIsLoading,
  updatePreviewSelectedId,
} from './index';

import { useAppSelector } from '@/state/store';
import { AssetInfoType } from '@/global/types';
import { APP_API_URL } from '@/global/constants';
import useFetchAPI from '@/hooks/useFetchAPI';

// === displayedAssets ===

export const useDisplayedAssets = () =>
  useAppSelector((state) => state.gallery.displayedAssets) as AssetInfoType[];

export const useUpdateDisplayedAssets = () => {
  const dispatch = useDispatch();
  const fetchAPI = useFetchAPI();
  const updateOpenedAssets = useUpdateOpenedAssets();
  const updateIsLoading = useUpdateIsLoading();

  const handleUpdateDisplayedAssets = () => {
    updateIsLoading(true);
    Promise.all([
      fetchAPI(`${APP_API_URL}/list_assets`, 'POST'),
      fetchAPI(`${APP_API_URL}/list_template_assets`, 'POST'),
    ])
      .then(([listedAssets, templateAssets]) => {
        const assets = [...listedAssets.data, ...templateAssets.data];
        dispatch(updateDisplayedAssets(assets));
        updateOpenedAssets(assets);
        updateIsLoading(false);
      })
      .catch(() => {
        updateIsLoading(false);
      });
  };

  return handleUpdateDisplayedAssets;
};

// === previewSelectedId ===

export const usePreviewSelectedId = () =>
  useAppSelector((state) => state.gallery.previewSelectedId) as number | null;

export const useUpdatePreviewSelectedId = () => {
  const previewSelectedId = usePreviewSelectedId();
  const dispatch = useDispatch();

  return (id: number) => {
    dispatch(
      updatePreviewSelectedId(
        previewSelectedId === null ? id : previewSelectedId === id ? null : id
      )
    );
  };
};

export const usePreviewSelectedAsset = () => {
  const previewSelectedId = usePreviewSelectedId();
  const displayedAssets = useDisplayedAssets();

  if (!previewSelectedId) return null;
  return displayedAssets.filter((asset) => asset.uid === previewSelectedId)[0];
};

// === isLoading ===

export const useIsLoading = () =>
  useAppSelector((state) => state.gallery.isLoading) as boolean;

export const useUpdateIsLoading = () => {
  const dispatch = useDispatch();

  return (state: boolean) => {
    dispatch(updateIsLoading(state));
  };
};
