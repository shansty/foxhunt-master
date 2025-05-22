import type { Dispatch } from 'redux';

import {
  enqueueNotifySnackbar,
  closeNotifySnackbar,
  removeNotifySnackbar,
} from 'src/store/slices/notificationsSlice';
import type { Notification } from 'src/types/Notification';

export interface Action<Payload> {
  type: string;
  payload: Payload;
  meta?: boolean;
}

export interface NotificationAction
  extends Action<{
    key: string | number;
    notification: Notification;
    dismissAll: boolean;
  }> {}

export const enqueueSnackbar =
  (notification: Notification) => (dispatch: Dispatch<NotificationAction>) => {
    const key = notification.options && notification.options.key;
    dispatch(
      enqueueNotifySnackbar({
        notification: {
          ...notification,
          key: key || new Date().getTime() + Math.random(),
        },
      }),
    );
  };

export const closeSnackbar =
  (key: string | number) => (dispatch: Dispatch<NotificationAction>) => {
    dispatch(closeNotifySnackbar({ dismissAll: !key, key }));
  };

export const removeSnackbar =
  (key: string | number) => (dispatch: Dispatch<NotificationAction>) => {
    dispatch(removeNotifySnackbar({ key }));
  };
