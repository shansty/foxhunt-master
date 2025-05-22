const ORGANIZATIONS_PATH = '/organizations';
const USERS_PATH = '/users';
const LOGIN_PATH = `/login`;
const NOT_FOUND_PATH = `/not_found`;
const INVITATIONS_PATH = '/user-invitations';
const FEEDBACK_PATH = '/user-feedbacks';
const FEATURES_PATH = '/features';
const FEATURE_MANAGMENT_PATH = '/feature-managment';
const FEATURE_ASSIGNMENT_PATH = '/feature-assignment';
const PACKAGE_ASSIGNMENT_PATH = '/package-assignment';
const RATE_PLAN_PATH = '/rate-plans';

const NEW = '/new';
const EDIT = '/edit';

const ID = '/:id';

const buildUrl = (...parts: string[]) =>
  parts.reduce((previousValue, currentValue) => {
    currentValue = currentValue.toString().replace(/^\/+/, '');
    return `${previousValue}/${currentValue}`;
  }, '');

export const buildLinkToEditOrganizationPage = (
  organizationId: string | number,
) => buildUrl(ORGANIZATIONS_PATH, organizationId.toString(), EDIT);

export const buildOrganizationUrl = () => ORGANIZATIONS_PATH;

export const buildNewOrganizationUrl = () => buildUrl(ORGANIZATIONS_PATH, NEW);

export const buildEditOrganizationUrl = () =>
  buildUrl(ORGANIZATIONS_PATH, ID, EDIT);

export const buildUsersUrl = () => USERS_PATH;

export const buildNewUserUrl = () => buildUrl(USERS_PATH, NEW);

export const buildLoginUrl = () => LOGIN_PATH;

export const buildNotFoundUrl = () => NOT_FOUND_PATH;

export const buildUserInvitationUrl = () => INVITATIONS_PATH;

export const buildAllOrganizationsFeedbacksUrl = () =>
  buildUrl(ORGANIZATIONS_PATH, FEEDBACK_PATH);

export const buildFeaturesUrl = () => FEATURES_PATH;

export const buildFeatureManagmentUrl = () => FEATURE_MANAGMENT_PATH;

export const buildFeatureAssignmentUrl = () => FEATURE_ASSIGNMENT_PATH;

export const buildPackageAssignmentUrl = () => PACKAGE_ASSIGNMENT_PATH;

export const buildRatePlansUrl = () => RATE_PLAN_PATH;
