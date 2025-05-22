import { createSelector } from 'reselect';
import { AppState } from '../../types/States';

export const allUsersStateSelector = (state: AppState) => state.allUsersReducer;

export const selectAllUsers = createSelector(
  allUsersStateSelector,
  (state) => state.allUsers,
);

export const selectError = createSelector(
  allUsersStateSelector,
  (state) => state.error,
);

export const selectAllUsersLoadingState = createSelector(
  allUsersStateSelector,
  (state) => state.isLoading,
);
