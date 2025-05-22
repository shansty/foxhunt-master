import { createSlice } from '@reduxjs/toolkit';

import { fetchDistanceTypes } from 'src/store/actions/distanceTypeActions';
import { ENTITY as distanceType } from 'src/store/actions/types/distanceType';
import type { DistanceTypeSliceState } from './types';

const initialState: DistanceTypeSliceState = {
  distanceTypes: [],
};

export const distanceTypeSlice = createSlice({
  name: distanceType,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDistanceTypes.fulfilled, (state, { payload }) => {
      state.distanceTypes = payload;
    });
  },
});

export default distanceTypeSlice.reducer;
