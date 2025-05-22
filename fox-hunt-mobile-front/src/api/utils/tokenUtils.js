import AsyncStorage from '@react-native-community/async-storage';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TOKEN_EXPIRATION_TIME,
  TOKEN_EXPIRATION_IN_SECONDS,
  EMAIL,
} from '@env';

export const saveJwtRespToAsyncStore = async (tokensData, email) => {
  const tokenExpirationTime =
    new Date().getTime() + tokensData.expiresInSeconds * TOKEN_EXPIRATION_IN_SECONDS;
  await AsyncStorage.setItem(ACCESS_TOKEN, tokensData.token);
  await AsyncStorage.setItem(REFRESH_TOKEN, tokensData.refreshToken);
  await AsyncStorage.setItem(TOKEN_EXPIRATION_TIME, `${tokenExpirationTime}`);
  await AsyncStorage.setItem(EMAIL, email);
};

export const removeJwtFromAsyncStore = async () => {
  await AsyncStorage.removeItem(ACCESS_TOKEN);
  await AsyncStorage.removeItem(REFRESH_TOKEN);
  await AsyncStorage.removeItem(TOKEN_EXPIRATION_TIME);
  await AsyncStorage.removeItem(EMAIL);
};

export const getEmailFromAsyncStore = async () => await AsyncStorage.getItem(EMAIL);

export const getTokenFromAsyncStore = async () => await AsyncStorage.getItem(ACCESS_TOKEN);
