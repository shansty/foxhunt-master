import { createSlice } from '@reduxjs/toolkit';

import type { ThemeOptionsSliceState } from './types';
import { ENTITY as themeOptions } from 'src/store/actions/types/themeOptionsTypes';

const initialState: ThemeOptionsSliceState = {
  sidebarFixed: true,
  sidebarToggleMobile: false,
  headerFixed: true,
  headerShadow: true,
  footerFixed: false,
};

export const themeOptionsSlice = createSlice({
  name: themeOptions,
  initialState,
  reducers: {
    setSidebarToggleMobile: (state, { payload }) => {
      state.sidebarToggleMobile = payload;
    },
  },
});

export const { setSidebarToggleMobile } = themeOptionsSlice.actions;

export default themeOptionsSlice.reducer;
