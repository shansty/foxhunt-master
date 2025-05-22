import composeSimpleApiCallingAction from './common/composeSimpleApiCallingAction';
import { FeatureActionTypes } from './types/featureActionTypes';
import { featuresApi } from '../../api';
import history from '../../history';
import { enqueueSnackbar } from './notificationActions';
import {
  createFeatureEditionSuccessfulMessage,
  createFeatureEditionErrorMessage,
} from '../../utils/notificationUtil';
import { buildFeatureManagmentUrl } from '../../utils/RoutingUtil';
import { Feature } from '../../types/Feature';
import { NotificationDispatch } from '../../types/Dispatch';

export const fetchFeatures = composeSimpleApiCallingAction(
  FeatureActionTypes.fetch.request,
  FeatureActionTypes.fetch.success,
  FeatureActionTypes.fetch.failure,
  async function () {
    return await featuresApi.getAll();
  },
);

export const updateFeature = composeSimpleApiCallingAction(
  FeatureActionTypes.update.request,
  FeatureActionTypes.update.success,
  FeatureActionTypes.update.failure,
  async function (feature: Partial<Feature>) {
    return await featuresApi.patch(feature, feature.id);
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createFeatureEditionSuccessfulMessage(dispatch)));
    history.push(buildFeatureManagmentUrl());
  },
  async function (dispatch: NotificationDispatch) {
    dispatch(enqueueSnackbar(createFeatureEditionErrorMessage(dispatch)));
  },
);
