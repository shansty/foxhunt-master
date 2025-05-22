import { configureStore } from '@reduxjs/toolkit';

import { loadersMiddleware } from 'src/store/middlewares/loadersMiddleware';
import { apiError } from 'src/store/middlewares/apiError';
import * as reducers from 'src/store/slices';

const store = configureStore({
  reducer: {
    authReducer: reducers.authReducer,
    featureReducer: reducers.featureReducer,
    usersReducer: reducers.usersReducer,
    competitionsReducer: reducers.competitionsReducer,
    distanceTypesReducer: reducers.distanceTypesReducer,
    sseReducer: reducers.sseReducer,
    helpContentReducer: reducers.helpContentReducer,
    locationPackagesReducer: reducers.locationPackagesReducer,
    locationsReducer: reducers.locationsReducer,
    participantsReducer: reducers.participantsReducer,
    replayReducer: reducers.replayReducer,
    themeOptionsReducer: reducers.themeOptionsReducer,
    tooltipsReducer: reducers.tooltipsReducer,
    loadersReducer: reducers.loadersReducer,
    errorReducer: reducers.errorReducer,
    notificationReducer: reducers.notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(loadersMiddleware, apiError),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
