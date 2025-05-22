import moment from 'moment';
import SoundPlayer from 'react-native-sound-player';
// import RNSimpleCompass from 'react-native-simple-compass';
import Geolocation from '@react-native-community/geolocation';
import { RNNotificationBanner } from 'react-native-notification-banner';
import {
  SET_ERROR,
  SET_VOLUME,
  SET_FREQUENCY,
  SWITCH_IS_LOADING,
  CHANGE_USER_DIRECTION,
  CHANGE_USER_LOCATION,
  START_PARTICIPATION,
  SET_CURRENT_SOUND,
  SET_FREQUENCY_CLOSENESS,
  SET_CALCULATED_SOUND_LEVEL,
  FINISH_PARTICIPATION,
  SET_IS_FINISHED,
  CLEAR_STATE,
} from '../../../../utils/constants/mainActionTypes';
import {
  TWO_FRACTION_DIGITS,
  ZERO_FRACTION_DIGITS,
} from '../../../../utils/constants/commonConstants';
import { defaultState } from '../CompetitionDefaultState';
import playSound from '../../../../utils/soundUtils/playSound';
import subscribeToUserLocation from '../../../../utils/userLocation/subscribeToUserLocation';

export const startParticipation = (dispatch) =>
  async (changeParticipantPosition, changeParticipantDirection, setIsError, userLocation) => {
    try {
      const startOfParticipation = moment();
      changeParticipantPosition(userLocation);
      subscribeToUserLocation(changeParticipantPosition, changeParticipantDirection, setIsError);
      const soundInterval = await playSound();

      dispatch({
        type: START_PARTICIPATION,
        payload: { startOfParticipation, soundInterval },
      });

      dispatch({
        type: SWITCH_IS_LOADING,
        payload: { isLoading: false },
      });
    } catch (err) {
      console.log(err);
      setError(dispatch)(true);
    }
  };

export const finishParticipation = (dispatch) => (state) => {
  const { latitude, longitude, observerId } = state.userLocation;
  RNNotificationBanner.Dismiss();
  clearTimeout(state?.foxTimerId);

  // default observerID is 0;
  Geolocation.clearWatch(observerId || 0);
  Geolocation.stopObserving();
  // RNSimpleCompass.stop();

  SoundPlayer.stop();
  clearInterval(state.soundInterval);

  const completionTime = moment();
  const lastUserLocation = {
    latitude,
    longitude,
  };
  dispatch({
    type: FINISH_PARTICIPATION,
    payload: { checkList: { completionTime, lastUserLocation } },
  });
  dispatch({
    type: SET_IS_FINISHED,
    payload: true,
  });
};

export const changeFrequency = (dispatch) => (frequency, frequencyCloseness) => {
  dispatch({
    type: SET_FREQUENCY,
    payload: {
      frequency: frequency,
      frequencyCloseness: frequencyCloseness,
    },
  });
};

export const changeFrequencyCloseness = (dispatch) => (state) => {
  let frequencyCloseness = state.frequencyCloseness;
  if (state.gameState.currentFox) {
    frequencyCloseness = +Math.abs(
      state.gameState.currentFox.frequency - state.competition.frequency)
      .toFixed(TWO_FRACTION_DIGITS);
  }
  dispatch({
    type: SET_FREQUENCY_CLOSENESS,
    payload: { frequencyCloseness },
  });
};

export const changeSoundVolume = (dispatch) => (volumeCoefficient) => {
  const volume = +volumeCoefficient.toFixed(ZERO_FRACTION_DIGITS);
  dispatch({
    type: SET_VOLUME,
    payload: { volume },
  });
};

export const setCalculatedSoundLevel = (dispatch) => (calculatedSoundLevel) => {
  dispatch({
    type: SET_CALCULATED_SOUND_LEVEL,
    payload: { calculatedSoundLevel },
  });
};

export const setCurrentSound = (dispatch) => (soundName) => {
  dispatch({
    type: SET_CURRENT_SOUND,
    payload: { currentSound: soundName },
  });
};

export const changeParticipantPosition = (dispatch) => (position, observerId) => {
  // Observer id need for the unsubscribe from watchUserPosition
  const userLocation = {
    longitude: position.coords.longitude,
    latitude: position.coords.latitude,
    observerId: observerId || 0,
  };
  dispatch({
    type: CHANGE_USER_LOCATION,
    payload: userLocation,
  });
};

export const changeParticipantDirection = (dispatch) => (degree) => {
  dispatch({
    type: CHANGE_USER_DIRECTION,
    payload: degree,
  });
};

export const clearState = (dispatch) => () => {
  dispatch({
    type: CLEAR_STATE,
    payload: { defaultState },
  });
};

export const setError = (dispatch) => (isError) => {
  dispatch({
    type: SET_ERROR,
    payload: { isError },
  });
};
