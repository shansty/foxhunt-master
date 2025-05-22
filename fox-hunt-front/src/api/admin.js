import axios from 'axios';
import {
  API_ACTIVE_COMPETITIONS,
  API_AUTHENTICATE,
  API_COMPETITIONS,
  API_COMPETITIONS_TEMPLATES,
  API_CURRENT_USER,
  API_DISTANCE_TYPES,
  API_FEATURE_ORGANIZATION,
  API_HELP_CONTENT,
  API_LOCATIONS,
  API_LOCATION_PACKAGES,
  API_ORGANIZATIONS,
  API_REPLAY_COMPETITIONS,
  API_TOOLTIPS,
  API_USERS,
  API_USER_INVITATIONS,
} from './constants';
import * as inteceptors from './interceptors';

const locationsAPI = axios.create({ baseURL: API_LOCATIONS });
locationsAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const locationPackagesAPI = axios.create({
  baseURL: API_LOCATION_PACKAGES,
});
locationPackagesAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const competitionsAPI = axios.create({
  baseURL: API_COMPETITIONS,
});
competitionsAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const activeCompetitionsAPI = axios.create({
  baseURL: API_ACTIVE_COMPETITIONS,
});
activeCompetitionsAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const authAPI = axios.create({ baseURL: API_AUTHENTICATE });

const currentUserAPI = axios.create({
  baseURL: API_CURRENT_USER,
});
currentUserAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const organizationsAPI = axios.create({
  baseURL: API_ORGANIZATIONS,
});
organizationsAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const usersAPI = axios.create({ baseURL: API_USERS });
usersAPI.interceptors.request.use(inteceptors.authorisationHeadersInterceptor);

const distanceTypesAPI = axios.create({
  baseURL: API_DISTANCE_TYPES,
});
distanceTypesAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const replayCompetitionsAPI = axios.create({
  baseURL: API_REPLAY_COMPETITIONS,
});
replayCompetitionsAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const competitionTemplatesAPI = axios.create({
  baseURL: API_COMPETITIONS_TEMPLATES,
});
competitionTemplatesAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const featuresAPI = axios.create({
  baseURL: API_FEATURE_ORGANIZATION,
});
featuresAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const tooltipsAPI = axios.create({ baseURL: API_TOOLTIPS });
tooltipsAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const helpContentAPI = axios.create({
  baseURL: API_HELP_CONTENT,
});
helpContentAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

const invitationsAPI = axios.create({
  baseURL: API_USER_INVITATIONS,
});
invitationsAPI.interceptors.request.use(
  inteceptors.authorisationHeadersInterceptor,
);

export {
  locationsAPI,
  locationPackagesAPI,
  activeCompetitionsAPI,
  competitionsAPI,
  usersAPI,
  authAPI,
  currentUserAPI,
  distanceTypesAPI,
  replayCompetitionsAPI,
  organizationsAPI,
  featuresAPI,
  tooltipsAPI,
  helpContentAPI,
  competitionTemplatesAPI,
  invitationsAPI,
};
