const WELCOME_PAGE_URL = '/';

const LOGIN_URL = '/login';

const DOMAIN_URL = '/domain';

const SIGN_IN_URL = '/sign-in';

const SIGN_UP_URL = '/verify/:organization/invitation/accepted/*';

const DECLINE_URL = '/verify/:organization/invitation/declined/*';

const TOKEN = '/:token';

const RESET_PASSWORD_URL = '/reset-password';

const ONE_LOCATION_URL = 'location';

const LOCATIONS_URL = '/locations';

const ONE_LOCATION_PACKAGE_URL = '/location-package';

const LOCATION_PACKAGES_URL = '/location-packages';

const USERS_URL = '/users';

const ONE_COMPETITION_URL = '/competition';

const COMPETITIONS_URL = '/competitions';

const INVITATIONS = '/invitations';

const ID = '/:id';

const LAUNCH_URL = '/launch';

const WATCH_URL = '/watch';

const REPLAY_URL = '/replay';

const TIME_AND_LOCATION_URL = '/time-location';

const COMPETITION_SETTINGS_URL = '/settings';

const NEW_URL = '/new';

const PROFILE_URL = '/profile';

const TOOLTIPS_URL = '/tooltips';

const HELP_CONTENT = '/help-content';

const ORGANIZATION_SWITCH = '/organization-switch';

const COMPETITION_TEMPLATE_URL = '/competitions/template';

const NOT_FOUND = '/not-found';

const TOKEN_INVALID = '/token-invalid';

const buildUrl = (...parts) =>
  parts.reduce((previousValue, currentValue) => {
    currentValue = currentValue.toString().replace(/^\/+/, '');
    return `${previousValue}/${currentValue}`;
  }, '');

export const buildWelcomePageUrl = () => WELCOME_PAGE_URL;

export const buildDomainUrl = () => DOMAIN_URL;

export const buildSignInUrl = () => SIGN_IN_URL;

export const buildSignUpUrl = () => SIGN_UP_URL;

export const buildDeclineInvitationUrl = () => DECLINE_URL;

export const buildResetPasswordUrl = () => buildUrl(RESET_PASSWORD_URL, TOKEN);

export const buildLoginUrl = () => LOGIN_URL;

export const buildLocationUrl = () => LOCATIONS_URL;

export const buildCreateLocationUrl = () => buildUrl(ONE_LOCATION_URL, NEW_URL);

export const buildUpdateLocationUrl = () => buildUrl(LOCATIONS_URL, ID);

export const buildUpdateLocationByIdUrl = (id) => buildUrl(LOCATIONS_URL, id);

export const buildLocationPackageUrl = () => LOCATION_PACKAGES_URL;

export const buildCreateLocationPackageUrl = () =>
  buildUrl(ONE_LOCATION_PACKAGE_URL, NEW_URL);

export const buildUpdateLocationPackageByIdUrl = (id) =>
  buildUrl(LOCATION_PACKAGES_URL, id);

export const buildUpdateLocationPackageUrl = () =>
  buildUrl(LOCATION_PACKAGES_URL, ID);

export const buildCompetitionUrl = () => COMPETITIONS_URL;

export const buildCreateTimeAndLocationCompetitionUrl = () =>
  buildUrl(ONE_COMPETITION_URL, TIME_AND_LOCATION_URL);

export const buildUpdateTimeAndLocationCompetitionUrl = () =>
  buildUrl(COMPETITIONS_URL, ID, TIME_AND_LOCATION_URL);

export const buildUpdateTimeAndLocationCompetitionByIdUrl = (id) =>
  buildUrl(COMPETITIONS_URL, id, TIME_AND_LOCATION_URL);

export const buildUpdateSettingsCompetition = () =>
  buildUrl(COMPETITIONS_URL, ID, COMPETITION_SETTINGS_URL);

export const buildSettingsCompetitionByIdUrl = (id) =>
  buildUrl(COMPETITIONS_URL, id, COMPETITION_SETTINGS_URL);

export const buildCompetitionInvitationsByIdUrl = (id) =>
  buildUrl(COMPETITIONS_URL, id, INVITATIONS);

export const buildCompetitionInvitationsUrl = () =>
  buildUrl(COMPETITIONS_URL, ID, INVITATIONS);

export const buildLaunchOneCompetitionUrl = () =>
  buildUrl(COMPETITIONS_URL, ID, LAUNCH_URL);

export const buildLaunchCompetitionByIdUrl = (id) =>
  buildUrl(COMPETITIONS_URL, id, LAUNCH_URL);

export const buildOneCompetitionReplayUrl = () =>
  buildUrl(COMPETITIONS_URL, ID, REPLAY_URL);

export const buildReplayCompetitionById = (id) =>
  buildUrl(COMPETITIONS_URL, id, REPLAY_URL);

export const buildWatchOneCompetitionUrl = () =>
  buildUrl(COMPETITIONS_URL, ID, WATCH_URL);

export const buildWatchOneCompetitionByIdUrl = (id) =>
  buildUrl(COMPETITIONS_URL, id, WATCH_URL);

export const buildUserUrl = () => USERS_URL;

export const buildCreateUserUrl = () => buildUrl(USERS_URL, NEW_URL);

export const buildProfileUrl = () => PROFILE_URL;

export const buildUpdateProfileUrl = () => buildUrl(PROFILE_URL, ID);

export const buildUpdateBuIdProfileUrl = (id) => buildUrl(PROFILE_URL, id);

export const buildTooltipsUrl = () => TOOLTIPS_URL;

export const buildHelpContentUrl = () => HELP_CONTENT;

export const buildOrganizationSwitchUrl = () => ORGANIZATION_SWITCH;

export const buildNotFoundUrl = () => NOT_FOUND;

export const buildTokenInvalidUrl = () => TOKEN_INVALID;

export const buildCompetitionTemplateUrl = () =>
  buildUrl(COMPETITION_TEMPLATE_URL, ID);

export const buildCompetitionTemplateByIdUrl = (id) =>
  buildUrl(COMPETITION_TEMPLATE_URL, id);
