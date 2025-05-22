import { getTokenFromAsyncStore } from './tokenUtils';

export const authorisationHeadersInterceptor = async (request) => {
  const accessToken = await getTokenFromAsyncStore();
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return request;
};
