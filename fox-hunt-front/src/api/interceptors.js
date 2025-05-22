import * as tokenUtils from './utils/tokenUtils';

// TODO: replace console with the logger, when it's in place
export const authorisationHeadersInterceptor = async (request) => {
  const accessToken = tokenUtils.getAccessToken();

  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return request;
};
