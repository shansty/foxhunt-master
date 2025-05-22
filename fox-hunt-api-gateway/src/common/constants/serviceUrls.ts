export const swaggerServices = {
  gateway: { name: 'Gateway', url: '/gateway/swagger-ui-json' },
  feature: { name: 'Feature Service', url: '/feature/swagger-ui-json' },
  organization: {
    name: 'Organization Service',
    url: '/organization/swagger-ui-json',
  },
  admin: {
    name: 'Admin Service',
    url: '/admin/api-docs/foxhunt-admin-service',
  },
};

export const FEATURE_SERVICE_URLS = [
  '/features',
  '/feature-organization',
  swaggerServices.feature.url,
];

export const ORG_SERVICE_URLS = [
  '/organizations',
  '/org/organization-packages',
  '/org/user-feedbacks', // TODO: move to java
  swaggerServices.organization.url,
];

export const ADMIN_SERVICE_URLS = [
  '/users',
  '/locations',
  '/login/url', // TODO: this url is used with google auth, move to api gateway
  '/login/registration-info',
  '/login/organization-info',
  '/health',
  '/location-packages',
  '/organization-packages', // TODO: move to org service
  '/competitions',
  '/competition-templates',
  '/active-competitions',
  '/distance-types',
  '/replay-competitions',
  '/single-participant-competitions',
  '/user-feedbacks',
  '/help-content',
  '/tooltips',
  '/user-invitations',
  swaggerServices.admin.url,
];
