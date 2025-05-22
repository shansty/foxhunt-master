import composeSimpleApiCallingAction from './common/composeSimpleApiCallingAction';
import { FeatureOrganizationActionTypes } from './types/featureOrganizationActionTypes';
import { featureOrganizationApi } from '../../api';
import history from '../../history';
import { enqueueSnackbar } from './notificationActions';
import {
  createFeatureEditionSuccessfulMessage,
  createFeatureEditionErrorMessage,
} from '../../utils/notificationUtil';
import { buildFeatureAssignmentUrl } from '../../utils/RoutingUtil';
import { NotificationDispatch } from '../../types/Dispatch';
import { UpdateFeatureOrganization } from '../../types/FeatureOrganization';

export const fetchFeaturesOrganization = composeSimpleApiCallingAction(
  FeatureOrganizationActionTypes.fetch.request,
  FeatureOrganizationActionTypes.fetch.success,
  FeatureOrganizationActionTypes.fetch.failure,
  async function () {
    return await featureOrganizationApi.getAll();
  },
);

export const updateFeaturesOrganization = composeSimpleApiCallingAction(
  FeatureOrganizationActionTypes.update.request,
  FeatureOrganizationActionTypes.update.success,
  FeatureOrganizationActionTypes.update.failure,
  async function (data: UpdateFeatureOrganization) {
    return await featureOrganizationApi.patch(data);
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createFeatureEditionSuccessfulMessage(dispatch)));
    history.push(buildFeatureAssignmentUrl());
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createFeatureEditionErrorMessage(dispatch)));
  },
);
