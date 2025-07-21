import { Location } from 'src/types/Location';
import { User } from 'src/types/User';
import { DEFAULT_CENTER_COORDINATES } from './mapConst';
export const MIN_FOX_DURATION = 20;
export const MAX_FOX_DURATION = 300;
export const MIN_FOX_RANGE = 10;
export const MAX_FOX_RANGE = 3000;
export const FOX_FREQUENCY_144_MGZ = 144;
export const FOX_FREQUENCY_3_5_MGZ = 3.5;
export const DEFAULT_MAX_NUMBER_OF_FOXES = 5;
export const COMPETITION_NAME_MIN_LENGTH = 5;
export const COMPETITION_NAME_MAX_LENGTH = 40;
export const COMPETITION_NOTES_MAX_LENGTH = 500;
export const FIRST_NAME_MIN_LENGTH = 1;
export const LAST_NAME_MIN_LENGTH = 1;
export const CITY_NAME_MIN_LENGTH = 1;
export const EMAIL_REGEX =
  // eslint-disable-next-line max-len
  /^(?=.{1,254}$)(?=.{1,64}@)[-!#&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

export const ERRORS = {
  GENERAL_ERROR: 'Something went wrong, please try again later.',
  MAX_DATE_OF_BIRTH_MESSAGE: 'Birth date cannot be in the future',
  TOO_LONG_DATA: 'The entered data is too long',
  MUST_BE_DATE: 'The entered value must be a date',
  REQUIRED_FIELD: 'This field is required',
  LOADING_ERROR: 'Sorry! There was an error during data loading',
  TOO_LONG_EMAIL: 'The email entered is too long',
  INVALID_EMAIL: 'The email entered is invalid',
  REPEATED_EMAIL: 'The email has already been entered',
  SHORT_COMPETITION_NAME: `Name must be at least ${COMPETITION_NAME_MIN_LENGTH} characters length`,
  LONG_COMPETITION_NAME: `Name must be at most ${COMPETITION_NAME_MAX_LENGTH} characters`,
  TOO_SHORT_NAME: 'The chosen name is too short',
  TOO_LONG_NAME: 'The chosen name is too long',
  LOCATION_ALREADY_EXISTS: 'Location with this name already exists!',
  NOT_SAME_PASSWORDS: 'You entered different passwords',
  COMPETITION_MIN_START_DATE_MESSAGE: 'Start date cannot be in the past',
  ACCEPT_ONLY_LETTERS: 'Only English letters allowed',
};

export const FILE_SIZES = {
  B: 'B',
  KB: 'KB',
  MB: 'MB',
  GB: 'GB',
};

export const DEFAULT_USER_VALUES: User = {
  id: 1,
  email: 'test@gmail.com',
  activated: true,
  firstName: '',
  lastName: '',
};

export const DEFAULT_LOCATION_VALUES: Location = {
  center: DEFAULT_CENTER_COORDINATES,
  coordinates: [],
  createdBy: DEFAULT_USER_VALUES,
  description: '',
  forbiddenAreas: [],
  global: false,
  id: null,
  name: '',
  updatedBy: DEFAULT_USER_VALUES,
  zoom: 10,
  isFavorite: false,
};
