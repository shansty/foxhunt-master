import * as locationTypes from 'src/store/actions/types/locationsTypes';
import * as locationPackagesTypes from 'src/store/actions/types/locationPackagesTypes';
import * as competitionTypes from 'src/store/actions/types/competitionsTypes';
import * as usersTypes from 'src/store/actions/types/usersTypes';
import * as authTypes from 'src/store/actions/types/authTypes';
import { LOAD_AVAILIBLE_FEATURES } from 'src/store/actions/types/featureTypes';
import { GET_PARTICIPANTS } from 'src/store/actions/types/participantsTypes';

export const GENERAL_ERROR =
  'Oops, something went wrong. Please try again later';
export const ERROR_MESSAGE = {
  [locationTypes.GET_LOCATIONS]: 'Failed to load locations',
  [locationTypes.GET_LOCATION]: 'Failed to load location',
  [locationTypes.CREATE_LOCATION]: 'Failed to create location',
  [locationTypes.CLONE_LOCATION]: 'Failed to clone location',
  [locationTypes.UPDATE_LOCATION]: 'Failed to update location',
  [locationTypes.REMOVE_LOCATION]: 'Failed to remove location',
  [competitionTypes.GET_COMPETITIONS]: 'Failed to load competitions',
  [competitionTypes.GET_COMPETITION_BY_DATE]: 'Failed to load competition',
  [competitionTypes.GET_COMPETITION_BY_ID]: 'Failed to load competition',
  [competitionTypes.CREATE_COMPETITION]: 'Failed to update competition',
  [competitionTypes.UPDATE_COMPETITION]: 'Failed to update competition',
  [competitionTypes.REMOVE_COMPETITION]: 'Failed to remove competition',
  [locationPackagesTypes.GET_LOCATION_PACKAGE_BY_ID]:
    'Failed to load location package',
  [locationPackagesTypes.GET_LOCATION_PACKAGES]:
    'Failed to load location packages',
  [locationPackagesTypes.CREATE_LOCATION_PACKAGE]:
    'Failed to create location package',
  [locationPackagesTypes.UPDATE_LOCATION_PACKAGE]:
    'Failed to update location package',
  [locationPackagesTypes.REMOVE_LOCATION_PACKAGE]:
    'Failed to remove location package',
  [usersTypes.GET_USERS]: 'Failed to load users',
  [usersTypes.GET_USER_BY_ID]: 'Failed to load user',
  [usersTypes.UPDATE_USER]: 'Failed to update user',
  [LOAD_AVAILIBLE_FEATURES]: 'Failed to load features',
  [GET_PARTICIPANTS]: 'Failed to load participants',
  [authTypes.CHECK_DOMAIN]: 'Domain provided does not exist',
  [authTypes.GET_TOKENS]: 'Failed to log in',
  [authTypes.SET_USER_INFO]: 'Incorrect login or password',
  [authTypes.SET_ORGANIZATION_INFO]: 'Incorrect login or password',
  [authTypes.SEND_FORGOT_PASSWORD_REQUEST]:
    'Oops! Something goes wrong ... The email could not be sent!',
  [authTypes.RESET_PASSWORD]: 'Incorrect login or password',
  [authTypes.USER_AUTHENTICATION]: 'Incorrect login or password',
};
