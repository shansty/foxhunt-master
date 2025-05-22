import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/store/typings/root';

export const locationsStateSelector = (state: RootState) =>
  state.locationsReducer;

export const selectAllLocations = createSelector(
  locationsStateSelector,
  (state: RootState) => _.map(state.locations, (location) => location),
);

export const selectFavoriteLocations = (state: RootState) =>
  state.locationsReducer.favoriteLocations;

export const selectAllLocationsCount = (state: RootState) =>
  state.locationsReducer.size;

export const selectLocation = (state: RootState) =>
  state.locationsReducer.location;

export const selectLocationLoadingState = (state: RootState) =>
  state.locationsReducer.isLoading;
