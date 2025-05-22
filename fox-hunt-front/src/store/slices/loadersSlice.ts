import { createSlice } from '@reduxjs/toolkit';

import { LoadersState } from 'src/store/typings/loaders';
import { ENTITY as loaders } from 'src/store/actions/types/loaderTypes';

const initialState: LoadersState = {};

export const loadersSlice = createSlice({
  name: loaders,
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
});

export const { setLoading } = loadersSlice.actions;

export default loadersSlice.reducer;
