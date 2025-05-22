import { createSelector } from 'reselect';
import _ from 'lodash';
import { AppState } from '../../types/States';

export const packageStateSelector = (state: AppState) => state.packageReducer;

export const selectAllPackages = createSelector(
  packageStateSelector,
  (state) => state.packages,
);

export const selectAllOrganizationPackages = createSelector(
  packageStateSelector,
  (state) => state.organizationPackages,
);

export const selectPackageLoadingState = createSelector(
  packageStateSelector,
  (state) => state.isLoading,
);

export const selectError = createSelector(
  packageStateSelector,
  (state) => state.error,
);
