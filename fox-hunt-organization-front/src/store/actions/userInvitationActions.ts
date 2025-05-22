import composeSimpleApiCallingAction from './common/composeSimpleApiCallingAction';
import { UserInvitationActionTypes } from './types/userInvitationActionTypes';
import { userInvitationsApi } from '../../api';

export const fetchUserInvitations = composeSimpleApiCallingAction(
  UserInvitationActionTypes.fetch.request,
  UserInvitationActionTypes.fetch.success,
  UserInvitationActionTypes.fetch.failure,
  async function () {
    return await userInvitationsApi.getAll();
  },
);

export const resendUserInvitation = composeSimpleApiCallingAction(
  UserInvitationActionTypes.create.request,
  UserInvitationActionTypes.create.success,
  UserInvitationActionTypes.create.failure,
  async function (id: number) {
    return await userInvitationsApi.resendUserInvitation(id);
  },
);

export const declineUserInvitation = composeSimpleApiCallingAction(
  UserInvitationActionTypes.update.request,
  UserInvitationActionTypes.update.success,
  UserInvitationActionTypes.update.failure,
  async function (id: number) {
    return await userInvitationsApi.declineUserInvitation(id);
  },
);
