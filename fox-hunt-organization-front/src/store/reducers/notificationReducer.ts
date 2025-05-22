import * as actionTypes from '../actions/types/notificationActionTypes';
import { NotificationState } from '../../types/States';
import { NotificationAction } from '../../types/Actions';

const initialState: NotificationState = {
  notifications: [],
};

export default function (
  state = initialState,
  action: NotificationAction,
): NotificationState {
  switch (action.type) {
    case actionTypes.ENQUEUE_SNACKBAR:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.payload.key,
            ...action.payload.notification,
          },
        ],
      };
    case actionTypes.CLOSE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          action.payload.dismissAll || notification.key === action.payload.key
            ? { ...notification, dismissed: true }
            : { ...notification },
        ),
      };
    case actionTypes.REMOVE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.key !== action.payload.key,
        ),
      };

    default:
      return state;
  }
}
