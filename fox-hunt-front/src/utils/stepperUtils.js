import {
  STATUS_FINISHED,
  STATUS_RUNNING,
} from '../constants/competitionStatusConst';
import _ from 'lodash';

const COMPETITION_TIME_AND_LOCATION_STEP_NUMBER = 0;
const COMPETITION_SETTINGS_STEP_NUMBER = 1;
const COMPETITION_PARTICIPANTS_STEP_NUMBER = 2;
const COMPETITION_LAUNCH_STEP_NUMBER = 3;
const COMPETITION_WATCH_STEP_NUMBER = 4;

export const COMPETITION_TIME_AND_LOCATION = 'Time and Location';

export const COMPETITION_SETTINGS = 'Settings';

export const COMPETITION_PARTICIPANTS = 'Participants';

export const COMPETITION_LAUNCH = 'Launch';

export const COMPETITION_WATCH = 'Watch';

export const getAllCompetitionSteps = () => [
  COMPETITION_TIME_AND_LOCATION,
  COMPETITION_SETTINGS,
  COMPETITION_PARTICIPANTS,
  COMPETITION_LAUNCH,
  COMPETITION_WATCH,
];

export const getCompletedStep = (competition) => {
  if (competition?.status === STATUS_FINISHED) {
    return COMPETITION_WATCH_STEP_NUMBER;
  } else if (competition?.status === STATUS_RUNNING) {
    return COMPETITION_LAUNCH_STEP_NUMBER;
  } else if (!_.isEmpty(competition?.participants)) {
    return COMPETITION_PARTICIPANTS_STEP_NUMBER;
  } else if (competition?.foxAmount) {
    return COMPETITION_SETTINGS_STEP_NUMBER;
  } else if (competition?.name) {
    return COMPETITION_TIME_AND_LOCATION_STEP_NUMBER;
  }
};
