import composeSimpleApiCallingAction from './common/composeSimpleApiCallingAction';
import { OrganizationActionTypes } from './types/organizationActionTypes';
import { organizationsApi } from '../../api';
import history from '../../history';
import { enqueueSnackbar } from './notificationActions';
import {
  createChangeOrgStatusErrorMessage,
  createChangeOrgStatusSuccessfulMessage,
  createOrgCreationErrorMessage,
  createOrgCreationSuccessfulMessage,
  createOrgEditionErrorMessage,
  createOrgEditionSuccessfulMessage,
} from '../../utils/notificationUtil';
import { buildOrganizationUrl } from '../../utils/RoutingUtil';
import { Organization, OrganizationStatus } from '../../types/Organization';
import { NotificationDispatch } from '../../types/Dispatch';
import { GetUsersParams } from '../../types/RootUser';

export const createOrganization = composeSimpleApiCallingAction(
  OrganizationActionTypes.create.request,
  OrganizationActionTypes.create.success,
  OrganizationActionTypes.create.failure,
  async function (organization: Organization) {
    return await organizationsApi.create(organization);
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createOrgCreationSuccessfulMessage(dispatch)));
    history.push(buildOrganizationUrl());
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createOrgCreationErrorMessage(dispatch)));
  },
);

export const fetchOrganizations = composeSimpleApiCallingAction(
  OrganizationActionTypes.fetch.request,
  OrganizationActionTypes.fetch.success,
  OrganizationActionTypes.fetch.failure,
  async function () {
    return await organizationsApi.getAll();
  },
);

export const fetchOrganizationById = composeSimpleApiCallingAction(
  OrganizationActionTypes.fetchById.request,
  OrganizationActionTypes.fetchById.success,
  OrganizationActionTypes.fetchById.failure,
  async function (id: number) {
    return await organizationsApi.findById(id);
  },
);

export const updateOrganization = composeSimpleApiCallingAction(
  OrganizationActionTypes.update.request,
  OrganizationActionTypes.update.success,
  OrganizationActionTypes.update.failure,
  async function (organization: Organization) {
    return await organizationsApi.patch(organization, organization.id);
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createOrgEditionSuccessfulMessage(dispatch)));
    history.push(buildOrganizationUrl());
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createOrgEditionErrorMessage(dispatch)));
  },
);

export const changeOrganizationStatus = composeSimpleApiCallingAction(
  OrganizationActionTypes.changeOrgStatus.request,
  OrganizationActionTypes.changeOrgStatus.success,
  OrganizationActionTypes.update.failure,
  async function (id: number, status: OrganizationStatus) {
    return await organizationsApi.changeOrganizationStatus(id, status);
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createChangeOrgStatusSuccessfulMessage(dispatch)));
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createChangeOrgStatusErrorMessage(dispatch)));
  },
);
