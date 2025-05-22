import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';

export const locationPackagesStateSelector = (state) =>
  state.locationPackagesReducer;

export const selectAllLocationPackages = createSelector(
  locationPackagesStateSelector,
  (state) =>
    _.map(state.locationPackages, (locationPackage) => locationPackage),
);

export const selectAllLocationPackagesCount = (state) =>
  state.locationPackagesReducer.size;

export const selectLocationPackage = (state) =>
  state.locationPackagesReducer.locationPackage;

export const selectLocationPackageLoadingState = (state) =>
  state.locationPackagesReducer.isLoading;
