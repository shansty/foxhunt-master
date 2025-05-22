import { createAsyncThunk } from '@reduxjs/toolkit';
import md5 from 'md5';

import { usersAPI } from 'src/api/admin';
import { enqueueSnackbar } from './notificationsActions';
import {
  createSuccessMessage,
  createErrorMessage,
} from 'src/utils/notificationUtil';
import {
  NOTIFY_SUCCESS_USER_DEACTIVATION_MESSAGE,
  NOTIFY_SUCCESS_USER_ACTIVATION_MESSAGE,
  NOTIFY_ERROR_USER_DEACTIVATION_MESSAGE,
  NOTIFY_ERROR_USER_ACTIVATION_MESSAGE,
  NOTIFY_SUCCESS_USER_UPDATE_MESSAGE,
  NOTIFY_ERROR_USER_UPDATE_MESSAGE,
  NOTIFY_ERROR_GET_USER_INFO,
  NOTIFY_ERROR_USER_INVITATION,
  NOTIFY_ERROR_USER_IS_ALREADY_INVITED,
  NOTIFY_SUCCESS_USER_INVITATION_MESSAGE,
} from 'src/constants/notifyConst';
import { logOut } from './authActions';
import { updateLoggedUser } from 'src/store/slices/authSlice';
import * as usersTypes from './types/usersTypes';
import type { User } from 'src/types/User';
import { RolesEnum } from 'src/utils/types/roleTypes';

export const getUsers = createAsyncThunk(
  usersTypes.GET_USERS,
  async (
    params: Partial<{
      page: number;
      size: number;
    }> = {},
    { rejectWithValue },
  ) => {
    try {
      const { data } = await usersAPI.get('/', { params });
      const { data: size } = await usersAPI.get('/size');
      return { data, size };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getUserById = createAsyncThunk(
  usersTypes.GET_USER_BY_ID,
  async (userId: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await usersAPI.get(`/${userId}`);
      return response;
    } catch (error) {
      if (error.response.status !== 404) {
        dispatch(
          enqueueSnackbar(
            createErrorMessage(NOTIFY_ERROR_GET_USER_INFO, dispatch),
          ),
        );
      }
      return rejectWithValue(error.response);
    }
  },
);

export const inviteUsers = createAsyncThunk(
  usersTypes.INVITE_USERS,
  async (
    params: { emails: string[]; roles: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { emails, roles } = params;
      const response = await usersAPI.post('/', { emails, roles });
      dispatch(
        enqueueSnackbar(
          createSuccessMessage(
            NOTIFY_SUCCESS_USER_INVITATION_MESSAGE,
            dispatch,
          ),
        ),
      );
      return response;
    } catch (error) {
      if (error.response.status === 409) {
        dispatch(
          enqueueSnackbar(
            createErrorMessage(NOTIFY_ERROR_USER_IS_ALREADY_INVITED, dispatch),
          ),
        );
      }
      return rejectWithValue(error);
    }
  },
);

export const setUserActivation = createAsyncThunk(
  usersTypes.SET_USER_ACTIVATION,
  async (
    params: { roles: RolesEnum[]; userToManage: User },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { roles, userToManage } = params;
      const response = await usersAPI.post(`/${userToManage.id}/reactivation`, {
        roles,
      });
      dispatch(
        enqueueSnackbar(
          createSuccessMessage(
            NOTIFY_SUCCESS_USER_INVITATION_MESSAGE,
            dispatch,
          ),
        ),
      );
      return response;
    } catch (error) {
      if (error.response.status === 409) {
        dispatch(
          enqueueSnackbar(
            createErrorMessage(NOTIFY_ERROR_USER_INVITATION, dispatch),
          ),
        );
      }
      return rejectWithValue(error);
    }
  },
);

export const setUserDeactivation = createAsyncThunk(
  usersTypes.SET_USER_DEACTIVATION,
  async (
    params: {
      userToManage: User;
      isCurrentUserGettingDeactivated: boolean;
    },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { userToManage, isCurrentUserGettingDeactivated } = params;
      await usersAPI.patch(`/${userToManage.id}/deactivation`);
      isCurrentUserGettingDeactivated && dispatch(logOut());
      dispatch(
        enqueueSnackbar(
          createSuccessMessage(
            NOTIFY_SUCCESS_USER_DEACTIVATION_MESSAGE,
            dispatch,
          ),
        ),
      );

      return { ...userToManage, activated: !userToManage.activated };
    } catch (error) {
      const { userToManage } = params;
      userToManage.activated
        ? dispatch(
            enqueueSnackbar(
              createErrorMessage(
                NOTIFY_ERROR_USER_DEACTIVATION_MESSAGE,
                dispatch,
              ),
            ),
          )
        : dispatch(
            enqueueSnackbar(
              createErrorMessage(
                NOTIFY_ERROR_USER_ACTIVATION_MESSAGE,
                dispatch,
              ),
            ),
          );
      return rejectWithValue(error);
    }
  },
);

export const updateUser = createAsyncThunk(
  usersTypes.UPDATE_USER,
  async (
    params: { updatedUser: User; id: number | string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { updatedUser, id } = params;
      const isLoggedUserUpdate = !id;
      const response = await usersAPI.patch('/', updatedUser);
      dispatch(
        enqueueSnackbar(
          createSuccessMessage(NOTIFY_SUCCESS_USER_UPDATE_MESSAGE, dispatch),
        ),
      );
      if (isLoggedUserUpdate) {
        dispatch(updateLoggedUser(response.data));
      }
      return response;
    } catch (error) {
      dispatch(
        enqueueSnackbar(
          createErrorMessage(NOTIFY_ERROR_USER_UPDATE_MESSAGE, dispatch),
        ),
      );
      return rejectWithValue(error);
    }
  },
);

export const getGravatarImage = createAsyncThunk(
  usersTypes.GET_GRAVATAR_IMAGE,
  async (email: string, { rejectWithValue }) => {
    try {
      const emailHash = md5(email.trim().toLowerCase());
      const { url } = await fetch(
        `https://www.gravatar.com/avatar/${emailHash}?d=identicon`,
      );
      return url;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
