import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  getUsers,
  getUserById,
  inviteUsers,
  setUserDeactivation,
  updateUser,
  getGravatarImage,
} from 'src/store/actions/usersActions';
import type { User } from 'src/types/User';
import { ENTITY as users } from 'src/store/actions/types/usersTypes';
import type { UsersSliceState } from './types';

const initialState: UsersSliceState = {
  users: {},
  user: {},
};

export const usersSlice = createSlice({
  name: users,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, { payload }) => {
        const users = payload.data.reduce(
          (acc: {}, user: User) => ({
            ...acc,
            [user.id as number | string]: user,
          }),
          {},
        );
        state.users = users;
        state.size = payload.size;
      })
      .addCase(getUserById.fulfilled, (state, { payload }) => {
        state.users = { ...state.users, [payload.data.id]: payload.data };
        state.user = payload.data;
      })
      .addCase(setUserDeactivation.fulfilled, (state, { payload }) => {
        state.users = { ...state.users, [payload.id]: payload };
      })
      .addCase(getGravatarImage.fulfilled, (state, { payload }) => {
        state.user = { ...state.user, avatar: 'payload' };
      })
      .addMatcher(
        isAnyOf(updateUser.fulfilled, inviteUsers.fulfilled),
        (state, { payload }) => {
          state.users = { ...state.users, [payload.data.id]: payload.data };
        },
      );
  },
});

export default usersSlice.reducer;
