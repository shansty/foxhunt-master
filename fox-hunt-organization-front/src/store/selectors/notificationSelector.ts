import { createSelector } from 'reselect';
import { AppState } from '../../types/States';

export const notificationStateSelector = (state: AppState) =>
  state.notificationReducer;

export const selectNotifications = createSelector(
  notificationStateSelector,
  (state) => state.notifications,
);
