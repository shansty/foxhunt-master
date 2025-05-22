import composeSimpleApiCallingAction from './common/composeSimpleApiCallingAction';
import { UserActionTypes } from './types/userActionTypes';
import { usersApi } from '../../api';
import {
  GetUsersParams,
  UpdateOrganizationAdminBody,
  User,
} from '../../types/RootUser';
import { enqueueSnackbar } from './notificationActions';
import { NotificationDispatch } from '../../types/Dispatch';
import {
  createUserCreationErrorMessage,
  createUserCreationSuccessfulMessage,
  updateOrganizationAdminErrorMessage,
  updateOrganizationAdminSuccessfulMessage,
} from '../../utils/notificationUtil';
import history from '../../history';
import { buildUsersUrl } from '../../utils/RoutingUtil';

export const createUser = composeSimpleApiCallingAction(
  UserActionTypes.create.request,
  UserActionTypes.create.success,
  UserActionTypes.create.failure,
  async function (user: User) {
    return await usersApi.create(user);
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createUserCreationSuccessfulMessage(dispatch)));
    history.push(buildUsersUrl());
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createUserCreationErrorMessage(dispatch)));
  },
);

export const fetchUsers = composeSimpleApiCallingAction(
  UserActionTypes.fetchUsers.request,
  UserActionTypes.fetchUsers.success,
  UserActionTypes.fetchUsers.failure,
  async function (params: GetUsersParams) {
    return await usersApi.getUsers(params);
  },
);

export const updateOrganizationAdmin = composeSimpleApiCallingAction(
  UserActionTypes.updateOrganizationAdmin.request,
  UserActionTypes.updateOrganizationAdmin.success,
  UserActionTypes.updateOrganizationAdmin.failure,
  async function (body: UpdateOrganizationAdminBody) {
    return await usersApi.updateOrganizationAdmin(body);
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(
      enqueueSnackbar(updateOrganizationAdminSuccessfulMessage(dispatch)),
    );
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(updateOrganizationAdminErrorMessage(dispatch)));
  },
);
