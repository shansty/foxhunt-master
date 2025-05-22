import { createSlice } from '@reduxjs/toolkit';
import { loadAvailableFeatures } from 'src/store/actions/featureActions';
import { ENTITY as feature } from 'src/store/actions/types/featureTypes';
import type { FeatureSliceState } from './types';

const initialState: FeatureSliceState = {
  features: [],
};

export const featureSlice = createSlice({
  name: feature,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadAvailableFeatures.fulfilled, (state, { payload }) => {
      const features = payload.map((feature: { name: string }) => feature.name);
      state.features = features;
    });
  },
});

export default featureSlice.reducer;
