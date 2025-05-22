import { createSelector } from 'reselect';
import _ from 'lodash';
import { AppState } from '../../types/States';

export const featureStateSelector = (state: AppState) =>
  state.featureOrganizationReducer;

export const selectAllFeatureOrganization = createSelector(
  featureStateSelector,
  (state) => state.featureOrganizations,
);

export const selectFeatureOrganizationLoadingState = createSelector(
  featureStateSelector,
  (state) => state.isLoading,
);

export const selectError = createSelector(
  featureStateSelector,
  (state) => state.error,
);
