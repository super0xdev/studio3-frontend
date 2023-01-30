import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AssetInfoType } from '@/global/types';

export interface IGalleryState {
  readonly displayedAssets: AssetInfoType[];
  readonly templateAssets: AssetInfoType[];
  readonly displayedAssetsPreview: string[];
  readonly templateAssetsPreview: string[];
  readonly previewSelectedId: number | null;
  readonly isLoading: boolean;
}

const initialState: IGalleryState = {
  displayedAssets: [],
  templateAssets: [],
  displayedAssetsPreview: [],
  templateAssetsPreview: [],
  previewSelectedId: null,
  isLoading: false,
};

const GallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    updatePreviewSelectedId(state, action: PayloadAction<number | null>) {
      state.previewSelectedId = action.payload;
    },
    updateDisplayedAssets(state, action: PayloadAction<AssetInfoType[]>) {
      state.displayedAssets = action.payload;
    },
    updateTemplateAssets(state, action: PayloadAction<AssetInfoType[]>) {
      state.templateAssets = action.payload;
    },
    updateDisplayedAssetsPreview(state, action: PayloadAction<string[]>) {
      state.displayedAssetsPreview = action.payload;
    },
    updateTemplateAssetsPreview(state, action: PayloadAction<string[]>) {
      state.templateAssetsPreview = action.payload;
    },
    updateIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  updatePreviewSelectedId,
  updateDisplayedAssets,
  updateTemplateAssets,
  updateDisplayedAssetsPreview,
  updateTemplateAssetsPreview,
  updateIsLoading,
} = GallerySlice.actions;

export default GallerySlice.reducer;
