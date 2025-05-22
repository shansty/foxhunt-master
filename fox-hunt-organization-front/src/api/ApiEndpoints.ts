const API_GATEWAY_IP = !window?.injectEnv?.REACT_APP_PRODUCTION
  ? process.env.REACT_APP_GATEWAY_IP
  : window?.injectEnv?.REACT_APP_GATEWAY_IP; // prod url

const API_GATEWAY_PORT = !window?.injectEnv?.REACT_APP_PRODUCTION
  ? process.env.REACT_APP_GATEWAY_PORT
  : window?.injectEnv?.REACT_APP_GATEWAY_PORT; // prod url

const API_GATEWAY_VERSION = !window?.injectEnv?.REACT_APP_PRODUCTION
  ? process.env.REACT_APP_GATEWAY_VERSION
  : window?.injectEnv?.REACT_APP_GATEWAY_VERSION;

const API_GATEWAY_PREFIX = !window?.injectEnv?.REACT_APP_PRODUCTION
  ? process.env.REACT_APP_GATEWAY_PREFIX
  : window?.injectEnv?.REACT_APP_GATEWAY_PREFIX;

export const BASE_URL = `http://${API_GATEWAY_IP}:${API_GATEWAY_PORT}${API_GATEWAY_PREFIX}/${API_GATEWAY_VERSION}`;

export const API_AUTHENTICATE = `${BASE_URL}/login`;
export const API_USERS = `${BASE_URL}/users`;
export const API_ORGANIZATIONS = `${BASE_URL}/organizations`;
export const API_FEATURES = `${BASE_URL}/features`;

export const API_FEATURE_ORGANIZATION = `${BASE_URL}/feature-organization`;
export const API_USER_INVITATIONS = `${BASE_URL}/user-invitations`;
export const API_USER_FEEDBACKS = `${BASE_URL}/org/user-feedbacks`;
export const API_ORGANIZATION_PACKAGES = `${BASE_URL}/org/organization-packages`;
export const API_LOCATION_PACKAGES = `${BASE_URL}/location-packages`;
export const API_ALL_USERS = `${BASE_URL}/users/info?page=0&size=50`; // TBD, need to add pagination for client side
