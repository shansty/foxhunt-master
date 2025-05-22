import Axios from 'axios';
import {
  API_AUTHENTICATE,
  API_ORGANIZATIONS,
  API_USER_FEEDBACKS,
  API_USER_INVITATIONS,
  API_USERS,
  API_FEATURES,
  API_FEATURE_ORGANIZATION,
  API_ORGANIZATION_PACKAGES,
  API_LOCATION_PACKAGES,
  API_ALL_USERS,
} from './ApiEndpoints';
import * as interceptors from './interceptors/interceptors';

export const usersApiInstance = Axios.create({ baseURL: API_USERS });

usersApiInstance.interceptors.request.use(
  interceptors.authorisationHeadersInterceptor,
);

export const organizationsApiInstance = Axios.create({
  baseURL: API_ORGANIZATIONS,
});

organizationsApiInstance.interceptors.request.use(
  interceptors.authorisationHeadersInterceptor,
);

export const authApiInstance = Axios.create({ baseURL: API_AUTHENTICATE });

export const userInvitationsApiInstance = Axios.create({
  baseURL: API_USER_INVITATIONS,
});

userInvitationsApiInstance.interceptors.request.use(
  interceptors.authorisationHeadersInterceptor,
);

export const allUsersApiInstance = Axios.create({
  baseURL: API_ALL_USERS,
});

allUsersApiInstance.interceptors.request.use(
  interceptors.authorisationHeadersInterceptor,
);

export const banUnbanApiInstance = Axios.create({
  baseURL: API_USERS,
});

banUnbanApiInstance.interceptors.request.use(
  interceptors.authorisationHeadersInterceptor,
);

export const userFeedbackApiInstance = Axios.create({
  baseURL: API_USER_FEEDBACKS,
});

userFeedbackApiInstance.interceptors.request.use(
  interceptors.authorisationHeadersInterceptor,
);

export const featuresApiInstance = Axios.create({
  baseURL: API_FEATURES,
});

featuresApiInstance.interceptors.request.use(
  interceptors.authorisationHeadersInterceptor,
);

export const featureOrganizationApiInstance = Axios.create({
  baseURL: API_FEATURE_ORGANIZATION,
});

featureOrganizationApiInstance.interceptors.request.use(
  interceptors.authorisationHeadersInterceptor,
);

export const organizationPackagesApiInstance = Axios.create({
  baseURL: API_ORGANIZATION_PACKAGES,
});

organizationPackagesApiInstance.interceptors.request.use(
  interceptors.authorisationHeadersInterceptor,
);

export const packagesApiInstance = Axios.create({
  baseURL: API_LOCATION_PACKAGES,
});

packagesApiInstance.interceptors.request.use(
  interceptors.authorisationHeadersInterceptor,
);
