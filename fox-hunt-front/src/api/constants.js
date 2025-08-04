import { getViteEnv } from 'src/api/utils/getViteEnv';
const getEnv = () => {
  const isProd = window?.injectEnv?.REACT_APP_PRODUCTION;
  const viteEnv = getViteEnv();

  return {
    API_GATEWAY_IP: isProd
      ? window?.injectEnv?.REACT_APP_GATEWAY_IP
      : viteEnv.VITE_GATEWAY_IP ?? '',
    API_GATEWAY_PORT: isProd
      ? window?.injectEnv?.REACT_APP_GATEWAY_PORT
      : viteEnv.VITE_GATEWAY_PORT ?? '',
    API_GATEWAY_VERSION: isProd
      ? window?.injectEnv?.REACT_APP_GATEWAY_VERSION
      : viteEnv.VITE_GATEWAY_VERSION ?? '',
    API_GATEWAY_PREFIX: isProd
      ? window?.injectEnv?.REACT_APP_GATEWAY_PREFIX
      : viteEnv.VITE_GATEWAY_PREFIX ?? '',
  };
};

const {
  API_GATEWAY_IP,
  API_GATEWAY_PORT,
  API_GATEWAY_PREFIX,
  API_GATEWAY_VERSION,
} = getEnv();

export const BASE_URL = `http://${API_GATEWAY_IP}:${API_GATEWAY_PORT}${API_GATEWAY_PREFIX}/${API_GATEWAY_VERSION}`;

export const API_GOOGLE_AUTHENTICATE = `${BASE_URL}/google`;
export const API_AUTHENTICATE = `${BASE_URL}/login`;
export const API_USERS = `${BASE_URL}/users`;
export const API_ORGANIZATIONS = `${BASE_URL}/organizations`;
export const API_FEATURES = `${BASE_URL}/features`;
export const API_COMPETITIONS = `${BASE_URL}/competitions`;
export const API_FEATURE_ORGANIZATION = `${BASE_URL}/feature-organization/current`;
export const API_USER_INVITATIONS = `${BASE_URL}/user-invitations`;
export const API_USER_FEEDBACKS = `${BASE_URL}/org/user-feedbacks`;
export const API_ORGANIZATION_PACKAGES = `${BASE_URL}/org/organization-packages`;
export const API_LOCATION_PACKAGES = `${BASE_URL}/location-packages`;
export const API_ACTIVE_COMPETITIONS = `${BASE_URL}/active-competitions`;
export const API_CURRENT_USER = `${BASE_URL}/login/current-user/`;
export const API_DISTANCE_TYPES = `${BASE_URL}/distance-types`;
export const API_REPLAY_COMPETITIONS = `${BASE_URL}/replay-competitions`;
export const API_COMPETITIONS_TEMPLATES = `${BASE_URL}/competition-templates`;
export const API_TOOLTIPS = `${BASE_URL}/tooltips`;
export const API_HELP_CONTENT = `${BASE_URL}/help-content`;
export const API_LOCATIONS = `${BASE_URL}/locations`;
