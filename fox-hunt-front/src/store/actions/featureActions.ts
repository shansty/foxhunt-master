import { createAsyncThunk } from '@reduxjs/toolkit';

import { featuresAPI } from 'src/api/admin';
import { FEATURES } from 'src/store/constants/localStorageKeys';
import type { Feature } from 'src/types/Feature';
import * as featureTypes from './types/featureTypes';

export const loadAvailableFeatures = createAsyncThunk(
  featureTypes.LOAD_AVAILIBLE_FEATURES,
  async (params, { rejectWithValue }) => {
    try {
      const response = await featuresAPI.get('/', {});
      localStorage.setItem(
        FEATURES,
        JSON.stringify(response.data.map((feature: Feature) => feature.name)),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
