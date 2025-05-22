import { createAction } from './common/actionCreator';
import * as tokenUtils from '../../utils/tokenUtils';
import { AuthActionTypes } from './types/authActionTypes';
import history from '../../history';
import { buildLoginUrl } from '../../utils/RoutingUtil';
import { authApi } from '../../api';
import { SignInUser } from '../../types/SignInUser';
import { AuthDispatch } from '../../types/Dispatch';
import {
  REFRESH_TOKEN,
  IS_REFRESH_TOKEN_USED,
} from '../constants/localStorageConstants';

export const requestToken =
  (credentials: SignInUser) => async (dispatch: AuthDispatch) => {
    dispatch(createAction(AuthActionTypes.create.request));
    try {
      const response = await authApi.login(credentials);
      const tokensData = response.data;
      tokenUtils.saveJwtRespToLocalStore(tokensData);
      dispatch(createAction(AuthActionTypes.create.success, response.data));
    } catch (error) {
      dispatch(createAction(AuthActionTypes.create.failure, error));
    }
  };

export const refreshToken = () => async (dispatch: AuthDispatch) => {
  dispatch(createAction(AuthActionTypes.create.request));
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const isRefreshTokenUsed = localStorage.getItem(IS_REFRESH_TOKEN_USED);

    if (!isRefreshTokenUsed) return;

    if (!refreshToken) throw new Error();

    localStorage.setItem(IS_REFRESH_TOKEN_USED, '');
    const response = await authApi.refreshToken(refreshToken);
    tokenUtils.saveJwtRespToLocalStore(response.data);
    dispatch(createAction(AuthActionTypes.create.success, response.data));
    window.location.reload();
  } catch (error) {
    dispatch(logOut());
  }
};

export const logOut = () => async (dispatch: AuthDispatch) => {
  localStorage.clear();
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  if (refreshToken) await authApi.logout(refreshToken);
  history.push(buildLoginUrl());
  dispatch(createAction(AuthActionTypes.logout));
};
