import { Dispatch } from 'redux';
import { Notification } from '../../types/Notification';
import { createAction } from './common/actionCreator';
import * as notificationActionTypes from './types/notificationActionTypes';
import { NotificationAction } from '../../types/Actions';

export const enqueueSnackbar =
  (notification: Notification) => (dispatch: Dispatch<NotificationAction>) => {
    const key = notification.options && notification.options.key;
    dispatch(
      createAction(notificationActionTypes.ENQUEUE_SNACKBAR, {
        notification: {
          ...notification,
          key: key || new Date().getTime() + Math.random(),
        },
      }),
    );
  };

export const closeSnackbar =
  (key: string | number) => (dispatch: Dispatch<NotificationAction>) => {
    dispatch(
      createAction(notificationActionTypes.CLOSE_SNACKBAR, {
        dismissAll: !key,
        key,
      }),
    );
  };

export const removeSnackbar =
  (key: string | number) => (dispatch: Dispatch<NotificationAction>) => {
    dispatch(createAction(notificationActionTypes.REMOVE_SNACKBAR, { key }));
  };
