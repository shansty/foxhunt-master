import { createSelector } from 'reselect';
import _ from 'lodash';
import { AppState } from '../../types/States';

// uses nowhere in app
// const organizationIdSelector = (state, ownProps) => _.get(ownProps,
//     ['match', 'params', 'id']);

export const organizationStateSelector = (state: AppState) =>
  state.organizationReducer;

export const selectAllOrganizations = createSelector(
  organizationStateSelector,
  (state) => _.map(state.organizations, (organization) => organization),
);

export const selectOrganization = createSelector(
  organizationStateSelector,
  (state) => state.organization,
);

export const selectOrganizationLoadingState = createSelector(
  organizationStateSelector,
  (state) => state.isLoading,
);

export const selectError = createSelector(
  organizationStateSelector,
  (state) => state.error,
);

export const selectAllOrganizationTrainers = createSelector(
  organizationStateSelector,
  (state) => state.trainers,
);
