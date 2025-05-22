import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  loadTrackers,
  loadInitialTrackers,
} from 'src/store/actions/replayActions';
import { ENTITY as replay } from 'src/store/actions/types/replayTypes';
import type { ReplaySliceState } from './types';

const initialState: ReplaySliceState = {
  trackers: [],
};

export const replaySlice = createSlice({
  name: replay,
  initialState,
  reducers: {
    reloadReplay: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(loadTrackers.fulfilled, loadInitialTrackers.fulfilled),
      (state, { payload }) => {
        state.size = payload.size ? payload.size : state.size;
        state.trackers = payload.trackers;
      },
    );
  },
});

export const { reloadReplay } = replaySlice.actions;

export default replaySlice.reducer;
