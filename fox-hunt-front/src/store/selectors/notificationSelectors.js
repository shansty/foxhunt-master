export const notificationStateSelector = (state) => state.notificationReducer;

export const selectNotifications = (state) =>
  state.notificationReducer.notifications;
