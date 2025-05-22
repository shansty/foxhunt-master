import { createAsyncThunk } from '@reduxjs/toolkit';

import { distanceTypesAPI } from 'src/api/admin';
import * as distanceType from './types/distanceType';

export const fetchDistanceTypes = createAsyncThunk(
  distanceType.FETCH_DISTANCE_TYPE,
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await distanceTypesAPI.get('/');
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
