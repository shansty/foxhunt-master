import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

import * as FoxHuntPropTypes from 'src/utils/FoxHuntPropTypes';
import { convertToLocationPackageFromResponse } from 'src/api/utils/geometryConverter';
import {
  getLocationPackages,
  getLocationPackageById,
  createLocationPackage,
  updateLocationPackage,
  removeLocationPackage,
} from 'src/store/actions/locationPackagesActions';
import type { LocationPackage } from 'src/types/LocationPackage';
import { ENTITY as locationPackages } from 'src/store/actions/types/locationPackagesTypes';
import type { LocationPackagesSliceState } from './types';

const initialState: LocationPackagesSliceState = {
  locationPackages: {},
  locationPackage: FoxHuntPropTypes.locationPackage.defaultProps,
  size: 0,
};

export const locationPackagesSlice = createSlice({
  name: locationPackages,
  initialState,
  reducers: {
    closeLocationPackage: (state) => {
      state.locationPackage = FoxHuntPropTypes.locationPackage.defaultProps;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocationPackages.fulfilled, (state, { payload }) => {
        const locationPackages = payload.data.reduce(
          (acc: {}, loc: LocationPackage) => ({
            ...acc,
            [loc.locationPackageId as number]: loc,
          }),
          {},
        );
        state.locationPackages = locationPackages;
        state.size = payload.size;
      })
      .addCase(
        removeLocationPackage.fulfilled,
        (state, { payload }: PayloadAction<any, string>) => {
          state.locationPackages = _.omit(state.locationPackages, payload);
          state.size = state.size - 1;
        },
      )
      .addMatcher(
        isAnyOf(
          getLocationPackageById.fulfilled,
          createLocationPackage.fulfilled,
          updateLocationPackage.fulfilled,
        ),
        (state, { payload }) => {
          const locationPackage = convertToLocationPackageFromResponse(
            payload.data,
          );
          state.locationPackage = locationPackage;
          state.locationPackages = _.omit(
            state.locationPackages,
            locationPackage,
          );
        },
      );
  },
});

export const { closeLocationPackage } = locationPackagesSlice.actions;

export default locationPackagesSlice.reducer;
