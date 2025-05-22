import { createSelector } from 'reselect';
import { AppState } from '../../types/States';

export const userFeedbackStateSelector = (state: AppState) =>
  state.userFeedbackReducer;

export const selectUserFeedbacksMap = createSelector(
  userFeedbackStateSelector,
  (state) => state.userFeedbacks,
);

export const selectUserFeedbacksAllSizeMap = createSelector(
  userFeedbackStateSelector,
  (state) => state.userFeedbackAllSize,
);

export const selectUserFeedbacksIsLoading = createSelector(
  userFeedbackStateSelector,
  (state) => state.isLoading,
);
