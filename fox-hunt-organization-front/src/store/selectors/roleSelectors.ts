import { createSelector } from 'reselect';
import { AppState } from '../../types/States';

export const roleStateSelector = (state: AppState) => state.roleReducer;

export const selectRoles = createSelector(
  roleStateSelector,
  (state) => state.roles,
);
