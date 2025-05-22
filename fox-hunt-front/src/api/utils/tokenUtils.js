import * as localStorageKeys from 'src/store/constants/localStorageKeys';

export const getAccessToken = () =>
  localStorage.getItem(localStorageKeys.ACCESS_TOKEN);

export const getRefreshToken = () =>
  localStorage.getItem(localStorageKeys.REFRESH_TOKEN);

export const saveTokensToLocalStore = (tokensData) => {
  localStorage.setItem(localStorageKeys.ACCESS_TOKEN, tokensData.token);
  localStorage.setItem(localStorageKeys.REFRESH_TOKEN, tokensData.refreshToken);
  localStorage.setItem(localStorageKeys.IS_REFRESH_TOKEN_USED, 'true');
};
