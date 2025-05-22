import Button from '@mui/material/Button';
import { closeSnackbar } from '../store/actions/notificationActions';
import React from 'react';
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_INFO,
  NOTIFICATION_TYPE_SUCCESS,
  NOTIFICATION_TYPE_WARNING,
  NOTIFY_ERROR_ORGANIZATION_CREATION_MESSAGE,
  NOTIFY_ERROR_ORGANIZATION_EDITION_MESSAGE,
  NOTIFY_SUCCESS_FEATURE_EDITION_MESSAGE,
  NOTIFY_SUCCESS_ORGANIZATION_CREATION_MESSAGE,
  NOTIFY_SUCCESS_ORGANIZATION_EDITION_MESSAGE,
  NOTIFY_ERROR_FEATURE_EDITION_MESSAGE,
  NOTIFY_SUCCESS_PACKAGE_EDITION_MESSAGE,
  NOTIFY_ERROR_PACKAGE_EDITION_MESSAGE,
  NOTIFY_SUCCESS_USER_CREATION_MESSAGE,
  NOTIFY_ERROR_USER_CREATION_MESSAGE,
  NOTIFY_SUCCESS_ORGANIZATION_CHANGE_STATUS,
  NOTIFY_ERROR_ORGANIZATION_CHANGE_STATUS,
  NOTIFY_ERROR_UPDATE_ORG_ADMIN,
  NOTIFY_SUCCESS_UPDATE_ORG_ADMIN,
} from '../store/constants/notificationConstants';
import { VariantType } from 'notistack';
import { NotificationDispatch } from '../types/Dispatch';
import './styles.scss';

function createNotificationMessage(
  messageMessage: string,
  variant: VariantType,
  dispatch: NotificationDispatch,
) {
  return {
    message: messageMessage,
    options: {
      key: new Date().getTime() + Math.random(),
      variant: variant,
      action: (key: number) => (
        <Button
          id="dismiss-me-button"
          onClick={() => dispatch(closeSnackbar(key))}
        >
          Dismiss me
        </Button>
      ),
    },
  };
}

function createSuccessMessage(message: string, dispatch: NotificationDispatch) {
  return createNotificationMessage(
    message,
    NOTIFICATION_TYPE_SUCCESS,
    dispatch,
  );
}

function createErrorMessage(message: string, dispatch: NotificationDispatch) {
  return createNotificationMessage(message, NOTIFICATION_TYPE_ERROR, dispatch);
}

function createWarningMessage(message: string, dispatch: NotificationDispatch) {
  return createNotificationMessage(
    message,
    NOTIFICATION_TYPE_WARNING,
    dispatch,
  );
}

function createInfoMessage(message: string, dispatch: NotificationDispatch) {
  return createNotificationMessage(message, NOTIFICATION_TYPE_INFO, dispatch);
}

export function createOrgCreationSuccessfulMessage(
  dispatch: NotificationDispatch,
) {
  return createSuccessMessage(
    NOTIFY_SUCCESS_ORGANIZATION_CREATION_MESSAGE,
    dispatch,
  );
}

export function createOrgEditionSuccessfulMessage(
  dispatch: NotificationDispatch,
) {
  return createSuccessMessage(
    NOTIFY_SUCCESS_ORGANIZATION_EDITION_MESSAGE,
    dispatch,
  );
}

export function createChangeOrgStatusSuccessfulMessage(
  dispatch: NotificationDispatch,
) {
  return createSuccessMessage(
    NOTIFY_SUCCESS_ORGANIZATION_CHANGE_STATUS,
    dispatch,
  );
}

export function createOrgCreationErrorMessage(dispatch: NotificationDispatch) {
  return createErrorMessage(
    NOTIFY_ERROR_ORGANIZATION_CREATION_MESSAGE,
    dispatch,
  );
}

export function createOrgEditionErrorMessage(dispatch: NotificationDispatch) {
  return createErrorMessage(
    NOTIFY_ERROR_ORGANIZATION_EDITION_MESSAGE,
    dispatch,
  );
}

export function createChangeOrgStatusErrorMessage(
  dispatch: NotificationDispatch,
) {
  return createErrorMessage(NOTIFY_ERROR_ORGANIZATION_CHANGE_STATUS, dispatch);
}

export function createFeatureEditionSuccessfulMessage(
  dispatch: NotificationDispatch,
) {
  return createSuccessMessage(NOTIFY_SUCCESS_FEATURE_EDITION_MESSAGE, dispatch);
}

export function createFeatureEditionErrorMessage(
  dispatch: NotificationDispatch,
) {
  return createErrorMessage(NOTIFY_ERROR_FEATURE_EDITION_MESSAGE, dispatch);
}

export function createPackageEditionSuccessfulMessage(
  dispatch: NotificationDispatch,
) {
  return createSuccessMessage(NOTIFY_SUCCESS_PACKAGE_EDITION_MESSAGE, dispatch);
}

export function createPackageEditionErrorMessage(
  dispatch: NotificationDispatch,
) {
  return createErrorMessage(NOTIFY_ERROR_PACKAGE_EDITION_MESSAGE, dispatch);
}

export function createUserCreationSuccessfulMessage(
  dispatch: NotificationDispatch,
) {
  return createSuccessMessage(NOTIFY_SUCCESS_USER_CREATION_MESSAGE, dispatch);
}

export function createUserCreationErrorMessage(dispatch: NotificationDispatch) {
  return createErrorMessage(NOTIFY_ERROR_USER_CREATION_MESSAGE, dispatch);
}

export function updateOrganizationAdminSuccessfulMessage(
  dispatch: NotificationDispatch,
) {
  return createSuccessMessage(NOTIFY_SUCCESS_UPDATE_ORG_ADMIN, dispatch);
}

export function updateOrganizationAdminErrorMessage(
  dispatch: NotificationDispatch,
) {
  return createErrorMessage(NOTIFY_ERROR_UPDATE_ORG_ADMIN, dispatch);
}
