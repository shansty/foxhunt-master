import bytes from 'bytes';

export const NOTIFY_NOT_UNIQUE_COMPETITION_NAME = 'Not unique competition name';

export const NOTIFY_NOT_UNIQUE_LOCATION_NAME = 'Not unique location name';

export const NOTIFY_COORDINATES = 'You need to set at least 3 coordinates';

export const NOTIFY_MAP = 'You need to set start point on map';

export const NOTIFY_LOCATION_PACKAGE_TYPE =
  'You need to set location package type';

export const NOTIFY_NOT_SELF_INTERSECTING_POLYGON =
  'Your polygon should not be self-intersecting';

export const FORBIDDEN_AREA_OUT_OF_LOCATION =
  'Forbidden area should be inside location polygon';

export const NOTIFY_SUCCESS_LOCATION_CREATION_MESSAGE =
  'Location has been successfully created';

export const NOTIFY_SUCCESS_LOCATION_CLONE_MESSAGE =
  'Location has been successfully cloned';

export const NOTIFY_SUCCESS_LOCATION_EDITION_MESSAGE =
  'Location has been successfully updated';

export const NOTIFY_ERROR_LOCATION_CREATION_MESSAGE = `Something happened 
while the location was being created`;

export const NOTIFY_ERROR_LOCATION_EDITION_MESSAGE = `Something happened 
while the location was being updated`;

export const NOTIFY_SUCCESS_LOCATION_PACKAGE_CREATION_MESSAGE = `Location package 
has been successfully created`;

export const NOTIFY_SUCCESS_LOCATION_PACKAGE_EDITION_MESSAGE = `Location package 
has been successfully updated`;

export const NOTIFY_ERROR_LOCATION_PACKAGE_CREATION_MESSAGE = `Something happened 
while the location package was being created`;

export const NOTIFY_ERROR_LOCATION_PACKAGE_EDITION_MESSAGE = `Something happened 
while the location package was being updated`;

export const NOTIFY_SUCCESS_LOCATION_PACKAGE_REMOVAL_MESSAGE = `Location package 
has been successfully removed`;

export const NOTIFY_SUCCESS_USER_DEACTIVATION_MESSAGE =
  'User was successfully deactivated';

export const NOTIFY_SUCCESS_USER_ACTIVATION_MESSAGE =
  'User was successfully activated';

export const NOTIFY_SUCCESS_USER_INVITATION_MESSAGE =
  'User was successfully invited';

export const NOTIFY_ERROR_USER_DEACTIVATION_MESSAGE =
  'Something happened during user deactivation';

export const NOTIFY_ERROR_USER_ACTIVATION_MESSAGE =
  'Something happened during user activation';

export const NOTIFY_SUCCESS_USER_UPDATE_MESSAGE =
  'User info was successfully updated';

export const NOTIFY_ERROR_USER_UPDATE_MESSAGE =
  'Something happened during user info update';

export const NOTIFY_ERROR_GET_USER_INFO =
  'Something happened during user info loading';

export const NOTIFY_SEND_EMAIL_SUCCESS =
  'The email has been successfully sent to a specified address';

export const NOTIFY_SEND_EMAIL_ERROR =
  'Oops! Something goes wrong ... The email could not be sent!';

export const NOTIFY_ERROR_BAD_CREDENTIALS = 'Incorrect login or password';

export const NOTIFY_ERROR_NO_PERMISSION =
  "You don't have enough permission to access organization";

export const NOTIFY_ERROR_INVALID_DOMAIN = 'Domain provided does not exist';

export const NOTIFICATION_TYPE_SUCCESS = 'success';

export const NOTIFICATION_TYPE_ERROR = 'error';

export const NOTIFICATION_TYPE_WARNING = 'warning';

export const NOTIFICATION_TYPE_INFO = 'info';

export const NOTIFY_ERROR_GET_COMPETITION_INFO =
  'Something happened during competition info loading';

export const NOTIFY_ERROR_GET_LOCATION_INFO =
  'Something happened during location info loading';

export const NOTIFY_ERROR_GET_LOCATION_PACKAGE_INFO =
  'Something happened during location package info loading';

export const NOTIFY_ERROR_USER_INVITATION =
  'Some errors occurred while sending email';

export const NOTIFY_ERROR_USER_IS_ALREADY_INVITED = 'User is already invited';

export const NOTIFY_ERROR_DEACTIVATED_ORGANIZATION =
  'Organization was deactivated, please choose another organization';

export const getTooBigFileNotification = (maxSize, fileSizeUnit) =>
  `The uploaded file must be less than ${bytes(maxSize, fileSizeUnit)}`;
