import Button from '@mui/material/Button';
import { closeSnackbar } from '../store/actions/notificationsActions';
import React from 'react';
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
  NOTIFY_ERROR_LOCATION_CREATION_MESSAGE,
  NOTIFY_ERROR_LOCATION_EDITION_MESSAGE,
  NOTIFY_SUCCESS_LOCATION_CLONE_MESSAGE,
  NOTIFY_ERROR_LOCATION_PACKAGE_CREATION_MESSAGE,
  NOTIFY_ERROR_LOCATION_PACKAGE_EDITION_MESSAGE,
  NOTIFY_SUCCESS_LOCATION_CREATION_MESSAGE,
  NOTIFY_SUCCESS_LOCATION_EDITION_MESSAGE,
  NOTIFY_SUCCESS_LOCATION_PACKAGE_CREATION_MESSAGE,
  NOTIFY_SUCCESS_LOCATION_PACKAGE_EDITION_MESSAGE,
  NOTIFY_SUCCESS_LOCATION_PACKAGE_REMOVAL_MESSAGE,
} from '../constants/notifyConst';
import './styles.scss';

function createNotificationMessage(messageMessage, variant, dispatch) {
  return {
    message: messageMessage,
    options: {
      key: new Date().getTime() + Math.random(),
      variant: variant,
      // eslint-disable-next-line react/display-name
      action: (key) => (
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

export function createSuccessMessage(message, dispatch) {
  return createNotificationMessage(
    message,
    NOTIFICATION_TYPE_SUCCESS,
    dispatch,
  );
}

export function createErrorMessage(message, dispatch) {
  return createNotificationMessage(message, NOTIFICATION_TYPE_ERROR, dispatch);
}

export function createLocationCreationSuccessfulMessage(dispatch) {
  return createSuccessMessage(
    NOTIFY_SUCCESS_LOCATION_CREATION_MESSAGE,
    dispatch,
  );
}

export function createLocationEditionSuccessfulMessage(dispatch) {
  return createSuccessMessage(
    NOTIFY_SUCCESS_LOCATION_EDITION_MESSAGE,
    dispatch,
  );
}

export function createLocationCloneSuccessfulMessage(dispatch) {
  return createSuccessMessage(NOTIFY_SUCCESS_LOCATION_CLONE_MESSAGE, dispatch);
}

export function createLocationCreationErrorMessage(dispatch) {
  return createErrorMessage(NOTIFY_ERROR_LOCATION_CREATION_MESSAGE, dispatch);
}

export function createLocationEditionErrorMessage(dispatch) {
  return createErrorMessage(NOTIFY_ERROR_LOCATION_EDITION_MESSAGE, dispatch);
}

export function createLocationPackageCreationSuccessfulMessage(dispatch) {
  return createSuccessMessage(
    NOTIFY_SUCCESS_LOCATION_PACKAGE_CREATION_MESSAGE,
    dispatch,
  );
}

export function createLocationPackageEditionSuccessfulMessage(dispatch) {
  return createSuccessMessage(
    NOTIFY_SUCCESS_LOCATION_PACKAGE_EDITION_MESSAGE,
    dispatch,
  );
}

export function createLocationPackageCreationErrorMessage(dispatch) {
  return createErrorMessage(
    NOTIFY_ERROR_LOCATION_PACKAGE_CREATION_MESSAGE,
    dispatch,
  );
}

export function createLocationPackageEditionErrorMessage(dispatch) {
  return createErrorMessage(
    NOTIFY_ERROR_LOCATION_PACKAGE_EDITION_MESSAGE,
    dispatch,
  );
}

export function createLocationPackageRemovalSuccessfulMessage(dispatch) {
  return createSuccessMessage(
    NOTIFY_SUCCESS_LOCATION_PACKAGE_REMOVAL_MESSAGE,
    dispatch,
  );
}
