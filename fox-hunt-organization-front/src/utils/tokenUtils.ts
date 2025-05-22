import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  IS_REFRESH_TOKEN_USED,
} from '../store/constants/localStorageConstants';

interface TokenData {
  token: string;
  refreshToken: string;
  isRefreshTokenUsed?: string;
}
export const saveJwtRespToLocalStore = (tokensData: TokenData) => {
  localStorage.setItem(ACCESS_TOKEN, tokensData.token);
  localStorage.setItem(REFRESH_TOKEN, tokensData.refreshToken);
  localStorage.setItem(IS_REFRESH_TOKEN_USED, 'true');
};
