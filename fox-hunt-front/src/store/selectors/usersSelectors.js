import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';

export const usersStateSelector = (state) => state.usersReducer;

export const selectAllUsers = createSelector(usersStateSelector, (state) =>
  _.map(state.users, (user) => user),
);

export const selectUser = (state) => state.usersReducer.user;

export const selectAllUsersCount = (state) => state.usersReducer.size;

export const selectUsersLoadingState = (state) => state.usersReducer.isLoading;
