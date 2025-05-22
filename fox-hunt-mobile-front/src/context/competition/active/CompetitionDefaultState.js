import {
  INITIAL_FREQUENCY,
  INITIAL_FREQUENCY_CLOSENESS,
  INITIAL_VOLUME, TABLE_HEADER,
} from '../../../utils/constants/commonConstants';

export const defaultState = {
  foundFoxes: 0,
  isLoading: true,
  positionOutOfLocation: false,
  isError: false,
  isFound: false,
  isFinished: false,
  volume: INITIAL_VOLUME,
  calculatedSoundLevel: INITIAL_VOLUME,
  frequency: INITIAL_FREQUENCY,
  frequencyCloseness: INITIAL_FREQUENCY_CLOSENESS,
  startOfCompetition: {},
  startOfParticipation: {},
  userLocation: {},
  competitions: [],
  scv: [
    TABLE_HEADER,
  ],
};
