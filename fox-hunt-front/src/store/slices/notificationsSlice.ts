import { createSlice } from '@reduxjs/toolkit';

import type { NotificationsSliceState } from './types';
import { ENTITY as notifications } from 'src/store/actions/types/notificationsTypes';

const initialState: NotificationsSliceState = {
  notifications: [],
};

export const notificationsSlice = createSlice({
  name: notifications,
  initialState,
  reducers: {
    enqueueNotifySnackbar: (state, action) => {
      state.notifications = [
        ...state.notifications,
        {
          key: action.payload.key,
          ...action.payload.notification,
        },
      ];
    },
    closeNotifySnackbar: (state, action) => {
      state.notifications = state.notifications.map((notification) =>
        action.payload.dismissAll || notification.key === action.payload.key
          ? { ...notification, dismissed: true }
          : { ...notification },
      );
    },
    removeNotifySnackbar: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.key !== action.payload.key,
      );
    },
  },
});

export const {
  enqueueNotifySnackbar,
  closeNotifySnackbar,
  removeNotifySnackbar,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
