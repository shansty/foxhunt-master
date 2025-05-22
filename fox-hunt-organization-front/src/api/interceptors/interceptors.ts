import { ACCESS_TOKEN } from '../../store/constants/localStorageConstants';
import { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

export const authorisationHeadersInterceptor = (
  request: AxiosRequestConfig,
) => {
  if (!request.headers) request.headers = {};
  request.headers['Authorization'] = `Bearer ${localStorage.getItem(
    ACCESS_TOKEN,
  )}`;
  return request;
};
