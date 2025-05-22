import { createSelector } from 'reselect';
import { AppState } from '../../types/States';

export const authStateSelector = (state: AppState) => state.authReducer;

export const selectIsSignedIn = createSelector(
  authStateSelector,
  (state) => state && state.isSignedIn,
);

export const selectError = createSelector(
  authStateSelector,
  (state) => state && state.error,
);
