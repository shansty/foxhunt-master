import { createSelector } from 'reselect';
import _ from 'lodash';
import { AppState } from '../../types/States';

export const featureStateSelector = (state: AppState) => state.featureReducer;

export const selectAllFeatures = createSelector(
  featureStateSelector,
  (state) => state.features,
);

export const selectFeatureLoadingState = createSelector(
  featureStateSelector,
  (state) => state.isLoading,
);

export const selectError = createSelector(
  featureStateSelector,
  (state) => state.error,
);
