import { createAsyncThunk } from '@reduxjs/toolkit';
import md5 from 'md5';
import { isNil } from 'lodash';
import history from 'src/history';
import {
  authAPI,
  organizationsAPI,
  usersAPI,
  currentUserAPI,
  invitationsAPI,
} from 'src/api/admin';
import * as tokenUtils from 'src/api/utils/tokenUtils';
import { NOTIFY_ERROR_NO_PERMISSION } from 'src/constants/notifyConst';
import {
  buildSignInUrl,
  buildDomainUrl,
  buildWelcomePageUrl,
} from 'src/api/utils/navigationUtil';
import * as localStorageKeys from 'src/store/constants/localStorageKeys';
import { loadAvailableFeatures } from 'src/store/actions/featureActions';
import { enqueueSnackbar } from './notificationsActions';
import {
  createErrorMessage,
  createSuccessMessage,
} from 'src/utils/notificationUtil';
import { NOTIFY_SEND_EMAIL_SUCCESS } from 'src/constants/notifyConst';
import { userHasRoles } from 'src/utils/userUtils';
import { RolesEnum, RoleOperators } from 'src/utils/types/roleTypes';
import { fetchTokenSuccess } from 'src/store/slices/authSlice';
import { User } from 'src/types/User';
import * as authTypes from './types/authTypes';
import { cleanSignInState } from 'src/store/slices/authSlice';
import { saveTokensToLocalStore } from 'src/api/utils/tokenUtils';
import { INVITATION_STATUS } from '../constants/commonConstants';
import { API_GOOGLE_AUTHENTICATE } from 'src/api/constants';

export const refreshToken = createAsyncThunk(
  authTypes.REFRESH_TOKEN,
  async (params, { dispatch, rejectWithValue }) => {
    const refreshToken = localStorage.getItem(localStorageKeys.REFRESH_TOKEN);
    console.log('refreshToken: ', refreshToken);
    const isRefreshTokenUsed = localStorage.getItem(
      localStorageKeys.IS_REFRESH_TOKEN_USED,
    );

    if (
      isNil(refreshToken) ||
      isNil(localStorageKeys.IS_REFRESH_TOKEN_USED) ||
      isRefreshTokenUsed === ''
    ) {
      return;
    }

    try {
      const parameters = `refreshToken=${refreshToken}`;
      localStorage.setItem(localStorageKeys.IS_REFRESH_TOKEN_USED, '');

      const resp = await authAPI(`/refresh?${parameters}`, {
        method: 'post',
      });
      saveTokensToLocalStore(resp.data);
      dispatch(fetchTokenSuccess());
      window.location.reload();
    } catch (error) {
      dispatch(logOut());
      return rejectWithValue(error);
    }
  },
);

export const getTokens = createAsyncThunk(
  authTypes.GET_TOKENS,
  async (
    params: { code: string; domain: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { code, domain } = params;
      const response = await authAPI.get(
        `/token?code=${code}&domain=${domain}`,
        {},
      );
      const tokensData = response.data;
      tokenUtils.saveTokensToLocalStore(tokensData);
      dispatch(fetchTokenSuccess());
      return tokensData;
    } catch (error) {
      history.push(buildSignInUrl());
      return rejectWithValue(error);
    }
  },
);

export const checkDomain = createAsyncThunk(
  authTypes.CHECK_DOMAIN,
  async (domain: string, { rejectWithValue }) => {
    try {
      domain
        ? await organizationsAPI.head(`/domain/${domain}`)
        : (domain = (await organizationsAPI.get('/system')).data
            .organizationDomain);
      localStorage.setItem(localStorageKeys.DOMAIN, domain);
      history.push(buildSignInUrl());
      return domain;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const userAuthentication = createAsyncThunk(
  authTypes.USER_AUTHENTICATION,
  async (code, { dispatch, rejectWithValue }) => {
    try {
      const { data: tokensData } = await authAPI('/authentication', {
        method: 'post',
        data: code,
        withCredentials: true,
      });
      tokenUtils.saveTokensToLocalStore(tokensData);
      const { data: user } = await usersAPI.get('/current-user');
      if (!userHasRoles(user, [RolesEnum.PARTICIPANT], RoleOperators.ONLY)) {
        dispatch(fetchTokenSuccess());
      } else {
        dispatch(
          enqueueSnackbar(
            createErrorMessage(NOTIFY_ERROR_NO_PERMISSION, dispatch),
          ),
        );
      }
      return tokensData;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getOrganizationAdmin = createAsyncThunk(
  authTypes.GET_ORGANIZATION_ADMIN,
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { data: user } = await usersAPI.get('/admin');
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const setDeclinedReason = createAsyncThunk(
  authTypes.SET_DECLINED_REASON,
  async (
    params: { reason: { declinationReason: string }; token: string },
    { rejectWithValue },
  ) => {
    try {
      const { reason, token } = params;
      const response = await invitationsAPI(`/${token}/decline-reason`, {
        method: 'patch',
        data: reason,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const setUserInfo = createAsyncThunk(
  authTypes.SET_USER_INFO,
  async (userInfo: any, { rejectWithValue }) => {
    try {
      const { data: user } = await usersAPI('/registration-info', {
        method: 'post',
        data: {
          ...userInfo,
          domain: localStorage.getItem(localStorageKeys.DOMAIN),
        },
      });
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getLoginUrl = createAsyncThunk(
  authTypes.GET_LOGIN_URL,
  async (params, { rejectWithValue }) => {
    try {
      const { data: loginUrl } = await authAPI.get('/url');
      return loginUrl;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const googleUrl = API_GOOGLE_AUTHENTICATE;

export const loadLoggedUserInfo = createAsyncThunk(
  authTypes.LOAD_LOGGED_USER_INFO,
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { data: loggedUserInfo } = await usersAPI.get('/current-user');
      const { email, avatar } = loggedUserInfo;
      if (!avatar) {
        dispatch(getLoggedUserGravatarImage(email));
      }
      return loggedUserInfo;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const loadCurrentOrganization = createAsyncThunk(
  authTypes.LOAD_CURRENT_ORGANIZATION,
  async (params, { rejectWithValue }) => {
    try {
      const { data: currentOrganization } = await organizationsAPI.get(
        '/current',
      );
      return currentOrganization;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const logOut = createAsyncThunk(
  authTypes.LOG_OUT,
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(cleanSignInState());
      const refreshToken = tokenUtils.getRefreshToken();
      await authAPI.post(
        '/logout',
        { refreshToken: refreshToken },
        { withCredentials: true },
      );
      localStorage.clear();
      history.push(buildDomainUrl());
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const isInvitationValid = createAsyncThunk(
  authTypes.IS_INVITATION_VALID,
  async (link: string, { rejectWithValue }) => {
    try {
      const { data } = await invitationsAPI(link, { method: 'post' });
      if (data.status === INVITATION_STATUS.EXPIRED) {
        return rejectWithValue({
          response: {
            data: {
              message:
                ' Your invitation was expired. Please contact your administrator',
            },
          },
        });
      }
      localStorage.setItem(
        localStorageKeys.DOMAIN,
        data.organizationEntity.organizationDomain,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const sendForgotPasswordRequest = createAsyncThunk(
  authTypes.SEND_FORGOT_PASSWORD_REQUEST,
  async (user, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await usersAPI.post('/forgot-password', user);
      dispatch(
        enqueueSnackbar(
          createSuccessMessage(NOTIFY_SEND_EMAIL_SUCCESS, dispatch),
        ),
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const isResetPasswordLinkValid = createAsyncThunk(
  authTypes.IS_RESET_PASSWORD_LINK_VALID,
  async (link: string, { rejectWithValue }) => {
    try {
      const { data: resetPasswordData } = await usersAPI(link, {
        method: 'post',
      });
      return resetPasswordData;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const resetPassword = createAsyncThunk(
  authTypes.RESET_PASSWORD,
  async (params: { user: User; token: string }, { rejectWithValue }) => {
    try {
      const { user, token } = params;
      const { data: userAfterResetPassword } = await usersAPI.post(
        '/password',
        user,
        {
          params: { token },
        },
      );
      return userAfterResetPassword;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const switchDomain = createAsyncThunk(
  authTypes.SWITH_DOMAIN,
  async (payload: { domain: string }, { dispatch, rejectWithValue }) => {
    try {
      const { domain } = payload;
      const response = await currentUserAPI.put('/organization', payload);
      const { data: tokensData } = response;
      tokenUtils.saveTokensToLocalStore(tokensData);
      localStorage.setItem(localStorageKeys.DOMAIN, domain);
      dispatch(loadLoggedUserInfo());
      dispatch(loadCurrentOrganization());
      dispatch(loadAvailableFeatures());
      history.push(buildWelcomePageUrl());
      return domain;
    } catch (error) {
      // Address displaying back-end error messages (related to FOX-1403)
      dispatch(
        enqueueSnackbar(
          createErrorMessage(error.response.data.message, dispatch),
        ),
      );
      return rejectWithValue(error);
    }
  },
);

export const getLoggedUserGravatarImage = createAsyncThunk(
  authTypes.GET_LOGGED_USER_GRAVATAR_IMAGE,
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
