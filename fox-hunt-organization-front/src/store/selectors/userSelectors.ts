import { createSelector } from 'reselect';
import _ from 'lodash';
import { AppState } from '../../types/States';

export const userStateSelector = (state: AppState) => state.userReducer;

export const selectSingleUser = createSelector(userStateSelector, (state) =>
  _.first(state.users),
);

export const selectError = createSelector(
  userStateSelector,
  (state) => state.error,
);
