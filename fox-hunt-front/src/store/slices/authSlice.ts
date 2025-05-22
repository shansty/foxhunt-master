import { createSlice, isRejected, isAnyOf } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';

import {
  checkDomain,
  setUserInfo,
  getLoginUrl,
  loadLoggedUserInfo,
  loadCurrentOrganization,
  logOut,
  isInvitationValid,
  isResetPasswordLinkValid,
  resetPassword,
  switchDomain,
  getLoggedUserGravatarImage,
  getOrganizationAdmin,
} from 'src/store/actions/authActions';
import { ENTITY as auth } from 'src/store/actions/types/authTypes';
import type { AuthSliceState } from './types';
import { getGravatarImage } from '../actions/usersActions';

const initialState: Partial<AuthSliceState> = {
  isSignedIn: false,
  error: null,
  domain: '',
  currentOrganization: {},
};

const isARejectedAction = () =>
  isRejected(
    checkDomain,
    setUserInfo,
    getLoginUrl,
    loadLoggedUserInfo,
    loadCurrentOrganization,
    logOut,
    isInvitationValid,
    isResetPasswordLinkValid,
    resetPassword,
    switchDomain,
    getGravatarImage,
  );

export const authSlice = createSlice({
  name: auth,
  initialState,
  reducers: {
    setDefaultError: (state) => {
      state.error = null;
    },
    updateLoggedUser: (state, { payload }) => {
      state.loggedUser = payload;
    },
    fetchTokenSuccess: (state) => {
      state.isSignedIn = true;
    },
    fetchTokenFailure: (state) => {
      state.isSignedIn = false;
    },
    cleanSignInState: (state) => {
      state.isSignedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setUserInfo.fulfilled, (state, { payload }) => {
        state.userFromInvitation = payload;
      })
      .addCase(getLoginUrl.fulfilled, (state, { payload }) => {
        state.loginUrl = payload;
      })
      .addCase(loadLoggedUserInfo.fulfilled, (state, { payload }) => {
        state.loggedUser = payload;
      })
      .addCase(loadCurrentOrganization.fulfilled, (state, { payload }) => {
        state.currentOrganization = payload;
        state.domain = payload.organizationDomain;
      })
      .addCase(logOut.fulfilled, () => initialState)
      .addCase(isInvitationValid.fulfilled, (state, { payload }) => {
        state.invitation = payload;
      })
      .addCase(isResetPasswordLinkValid.fulfilled, (state, { payload }) => {
        state.resetPasswordRequest = payload;
      })
      .addCase(getOrganizationAdmin.fulfilled, (state, { payload }) => {
        state.organizationAdmin = payload;
      })
      .addCase(resetPassword.fulfilled, (state, { payload }) => {
        state.userAfterResetPassword = payload;
      })
      .addCase(getLoggedUserGravatarImage.fulfilled, (state, { payload }) => {
        state.loggedUser = { ...state.loggedUser, avatar: payload };
      })
      .addMatcher(
        isAnyOf(switchDomain.fulfilled, checkDomain.fulfilled),
        (state, { payload }) => {
          state.domain = payload;
        },
      )
      .addMatcher(isARejectedAction(), (state, action: AnyAction) => {
        state.error = action.payload;
      });
  },
});

export const {
  setDefaultError,
  updateLoggedUser,
  fetchTokenSuccess,
  fetchTokenFailure,
  cleanSignInState,
} = authSlice.actions;

export default authSlice.reducer;
