import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

import { convertToLocationFromResponse } from 'src/api/utils/geometryConverter';
import {
  getLocations,
  getLocationById,
  createLocation,
  cloneLocation,
  updateLocation,
  removeLocation,
  toggleFavoriteLocation,
  getFavoriteLocations,
} from 'src/store/actions/locationsActions';
import { DEFAULT_LOCATION_VALUES } from 'src/constants/commonConst';
import { ENTITY as locations } from 'src/store/actions/types/locationsTypes';
import type { LocationSliceState } from './types';

const initialState: LocationSliceState = {
  locations: {},
  location: DEFAULT_LOCATION_VALUES,
  favoriteLocations: [],
  size: 0,
};

export const locationsSlice = createSlice({
  name: locations,
  initialState,
  reducers: {
    clearCurrentLocationState: (state) => {
      state.location = DEFAULT_LOCATION_VALUES;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getLocations.fulfilled,
        (state, action: PayloadAction<{ data: any; size: number }, string>) => {
          state.locations = action.payload.data;
          state.size = action.payload.size;
        },
      )
      .addCase(getLocationById.fulfilled, (state, { payload }) => {
        state.location = convertToLocationFromResponse(payload.data);
      })
      .addCase(removeLocation.fulfilled, (state, { payload }) => {
        state.locations = _.omit(state.locations, payload);
        state.size = state.size - 1;
      })
      .addCase(toggleFavoriteLocation.fulfilled, (state, { payload }) => {
        state.favoriteLocations = state.favoriteLocations?.find(
          (loc) => loc.id === payload.id,
        )
          ? state.favoriteLocations.filter((el) => el.id !== payload.id)
          : [...state.favoriteLocations, payload];
      })
      .addCase(getFavoriteLocations.fulfilled, (state, { payload }) => {
        state.favoriteLocations = payload.data;
      })
      .addMatcher(
        isAnyOf(
          createLocation.fulfilled,
          cloneLocation.fulfilled,
          updateLocation.fulfilled,
        ),
        (state, { payload }) => {
          const responseLocation = convertToLocationFromResponse(payload?.data);
          state.locations = _.orderBy(
            { ...state.locations, [responseLocation.id]: responseLocation },
            ['name'],
            ['asc'],
          );
        },
      );
  },
});

export const { clearCurrentLocationState } = locationsSlice.actions;

export default locationsSlice.reducer;
