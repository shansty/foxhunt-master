import {
  userManageMultipleOrganizations,
  getUserRoles,
  userHasRoles,
} from 'src/utils/userUtils';
import { RolesEnum, RoleOperators } from 'src/utils/types/roleTypes';

export const authSelector = (state) => state.authReducer;

export const selectUserIsSignedIn = (state) => state.authReducer.isSignedIn;

export const selectDomain = (state) => state.authReducer.domain;

export const selectUserLoadingState = (state) => state.authReducer.isLoading;

export const selectCurrentOrganization = (state) =>
  state.authReducer.currentOrganization;

export const selectCurrentOrganizationAdmin = (state) =>
  state.authReducer.organizationAdmin;

export const selectUserError = (state) => state.authReducer.error;

export const selectUserInvitationError = (state) => state.authReducer.error;

export const selectUserInvitationLoadingState = (state) =>
  state.authReducer.isLoading;

export const selectInvitation = (state) => state.authReducer.invitation;

export const selectLoginUrl = (state) => state.authReducer.loginUrl;

export const selectLoggedUser = (state) => state.authReducer.loggedUser;

export const selectUserManageMultipleOrganizations = (state) => {
  return userManageMultipleOrganizations(state.authReducer.loggedUser);
};

export const selectLoggedUserRoles = (state) =>
  getUserRoles(state.authReducer.loggedUser);

export const selectHasUserCoachOrAdminRole = (state) =>
  userHasRoles(
    state.authReducer.loggedUser,
    [RolesEnum.COACH, RolesEnum.ADMIN],
    RoleOperators.OR,
  );

export const selectHasUserParticipantRoleOnly = (state) =>
  userHasRoles(
    state.authReducer.loggedUser,
    [RolesEnum.PARTICIPANT],
    RoleOperators.ONLY,
  );

export const selectHasUserParticipantRole = (state) =>
  userHasRoles(state.authReducer.loggedUser, [RolesEnum.PARTICIPANT]);

export const selectResetPasswordRequestError = (state) =>
  state.authReducer.error;

export const selectResetPasswordRequestLoadingState = (state) =>
  state.authReducer.isLoading;

export const selectResetPasswordRequest = (state) =>
  state.authReducer.resetPasswordRequest;
