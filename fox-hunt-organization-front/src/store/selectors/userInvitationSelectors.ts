import { createSelector } from 'reselect';
import { AppState } from '../../types/States';

export const userInvitationStateSelector = (state: AppState) =>
  state.userInvitationReducer;

export const selectUserInvitations = createSelector(
  userInvitationStateSelector,
  (state) => state.userInvitations,
);

export const selectError = createSelector(
  userInvitationStateSelector,
  (state) => state.error,
);

export const selectUserInvitationsLoadingState = createSelector(
  userInvitationStateSelector,
  (state) => state.isLoading,
);
