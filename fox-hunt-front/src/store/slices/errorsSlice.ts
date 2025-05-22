import { createSlice } from '@reduxjs/toolkit';

import { ErrorState } from 'src/store/typings/errors';
import { ENTITY as errors } from 'src/store/actions/types/errorTypes';

const initialState: ErrorState = {};

export const errorsSlice = createSlice({
  name: errors,
  initialState,
  reducers: {
    setError: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
});

export const { setError } = errorsSlice.actions;

export default errorsSlice.reducer;
