import composeSimpleApiCallingAction from './common/composeSimpleApiCallingAction';
import { PackageActionTypes } from './types/packageActionTypes';
import { packagesApi } from '../../api';
import history from '../../history';
import { enqueueSnackbar } from './notificationActions';
import {
  createPackageEditionSuccessfulMessage,
  createPackageEditionErrorMessage,
} from '../../utils/notificationUtil';
import { buildPackageAssignmentUrl } from '../../utils/RoutingUtil';
import { UpdateOrganizationPackage } from '../../types/Packages';
import { NotificationDispatch } from '../../types/Dispatch';

export const fetchOrganizationPackages = composeSimpleApiCallingAction(
  PackageActionTypes.fetchOrganizationPackages.request,
  PackageActionTypes.fetchOrganizationPackages.success,
  PackageActionTypes.fetchOrganizationPackages.failure,
  async function () {
    return await packagesApi.getAllOrganizationPackages();
  },
);

export const fetchPackages = composeSimpleApiCallingAction(
  PackageActionTypes.fetchPackages.request,
  PackageActionTypes.fetchPackages.success,
  PackageActionTypes.fetchPackages.failure,
  async function () {
    return await packagesApi.getAllPackages();
  },
);

export const updateOrganizationPackage = composeSimpleApiCallingAction(
  PackageActionTypes.update.request,
  PackageActionTypes.update.success,
  PackageActionTypes.update.failure,
  async function (updatePackages: UpdateOrganizationPackage) {
    return await packagesApi.updateOrganizationPackage(updatePackages);
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createPackageEditionSuccessfulMessage(dispatch)));
    history.push(buildPackageAssignmentUrl());
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createPackageEditionErrorMessage(dispatch)));
  },
);
