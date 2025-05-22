import moment from 'moment';
import { SINGLE_COMPETITION_PROCESS } from '../../../../utils/constants/routeNames';
import {
  CHANGE_CURRENT_FOX,
  POSITION_OUT_OF_POLYGON,
  SET_COMPETITION,
  SET_FOX_TIMER_ID,
  START_COMPETITION,
  TOGGLE_IS_FOX_FOUND,
  TRACK_GAME_STATE,
  UPDATE_FOUND_FOXES,
  UPDATE_FOX_POINTS,
} from '../../../../utils/constants/mainActionTypes';
import {
  DEFAULT_USER_RADIUS_FOR_SINGLE_COMPETITIONS,
  INITIAL_AMOUNT_OF_FOUND_FOXES,
  METERS_IN_KILOMETER,
  TIME_FORMAT,
  ZERO_FOX_INDEX,
} from '../../../../utils/constants/commonConstants';
import { navigate } from '../../../../navTools/rootNavigation';
import { distanceBetweenTwoPoints, isPointInsidePolygon } from '../../../../utils/mapUtils';
import { initializeCompetitionInfo } from '../../../../utils/competitionUtils';
import clearScvFolder from '../../../../utils/files/clearScvFolder';
import { setError } from './CompetitionActions';
import saveToFile from '../../../../utils/files/saveToFile';

export const initializeSingleCompetition = (dispatch) => (competitionConfig) => {
  try {
    const assembledCompetition = initializeCompetitionInfo(competitionConfig);
    dispatch({
      type: SET_COMPETITION,
      payload: {
        competition: assembledCompetition,
      },
    });
    return assembledCompetition;
  } catch (error) {
    setError(dispatch)(true);
  }
};

export const startSingleCompetition = (dispatch) => (competition) => {
  const startOfCompetition = moment();
  const gameState = {
    foundFoxes: INITIAL_AMOUNT_OF_FOUND_FOXES,
    currentFox: competition.foxPoints[ZERO_FOX_INDEX],
  };
  dispatch({
    type: START_COMPETITION,
    payload: {
      startOfCompetition,
      gameState,
    },
  });
  navigate(SINGLE_COMPETITION_PROCESS);
};

export const startSingleRadioOrienteeringCompetition = (dispatch) => (competition) => {
  const startOfCompetition = moment();
  const gameState = {
    foundFoxes: INITIAL_AMOUNT_OF_FOUND_FOXES,
    currentFox: competition.foxPoints[ZERO_FOX_INDEX],
    isRadioOrienteering: true,
  };
  dispatch({
    type: START_COMPETITION,
    payload: {
      startOfCompetition,
      gameState,
    },
  });
  navigate(SINGLE_COMPETITION_PROCESS);
};

export const setFoxTimerId = (dispatch) => (foxTimerId) => {
  dispatch({
    type: SET_FOX_TIMER_ID,
    payload: { foxTimerId },
  });
};

export const changeCurrentFoxInSingleCompetition = (dispatch) => (state) => {
  const { foxPoints } = state.competition;
  const { currentFox } = state.gameState;
  try {
    let currentFoxIndex = foxPoints.indexOf(currentFox);
    if (currentFoxIndex === (foxPoints.length - 1)) {
      if (state.competition.hasSilenceInterval) {
        dispatch({
          type: CHANGE_CURRENT_FOX,
          payload: { currentFox: null },
        });
        return;
      }
      currentFoxIndex = -1;
    }
    let newCurrentFox = foxPoints[currentFoxIndex + 1];
    currentFoxIndex += 1;
    while (newCurrentFox?.isFound) {
      if (currentFoxIndex === (foxPoints.length - 1)) {
        if (state.competition.hasSilenceInterval) {
          dispatch({
            type: CHANGE_CURRENT_FOX,
            payload: { currentFox: null },
          });
          return;
        }
        currentFoxIndex = -1;
      }
      newCurrentFox = foxPoints[currentFoxIndex + 1];
      currentFoxIndex += 1;
    }
    dispatch({
      type: CHANGE_CURRENT_FOX,
      payload: { currentFox: newCurrentFox },
    });
  } catch (e) {
    setError(dispatch)(true);
  }
};

export const findFoxInSingleCompetition = (dispatch) => (state, changeCurrentFox) => {
  try {
    const filteredFoxes = state.competition.foxPoints.filter((point) => !point.isFound);
    filteredFoxes.map((foxPoint) => {
      const isFound = isPointInsidePolygon(
        state.userLocation.latitude,
        state.userLocation.longitude,
        foxPoint.catchingArea,
      );
      if (isFound) {
        const foundedFox = filteredFoxes.find((fox) => fox.id === foxPoint.id);
        foundedFox.isFound = true;
        const newState = {
          ...state,
          competition: {
            ...state.competition,
            foxPoints: [...state.competition.foxPoints],
          },
        };
        newState.competition.foxPoints[foxPoint.index - 1] = foundedFox;
        dispatch({
          type: UPDATE_FOX_POINTS,
          payload: newState.competition.foxPoints,
        });
        dispatch({
          type: TOGGLE_IS_FOX_FOUND,
          payload: true,
        });
        dispatch({
          type: UPDATE_FOUND_FOXES,
          payload: (newState.gameState.foundFoxes + 1),
        });
        setTimeout(() => {
          dispatch({
            type: TOGGLE_IS_FOX_FOUND,
            payload: false,
          });
        }, 5000);
        if (state.gameState.currentFox?.id === foxPoint.id) {
          // Last fox found
          if (filteredFoxes.length === 1) return;
          changeCurrentFox(newState);
        }
      }
    });
  } catch (e) {
    setError(dispatch)(true);
  }
};

export const positionOutOfLocationInSingleCompetition = (dispatch) => (state) => {
  const { latitude, longitude } = state.userLocation;
  try {
    if (latitude && longitude) {
      const positionOutOfLocation = !isPointInsidePolygon(
        latitude,
        longitude,
        state.competition.polygon,
      );
      dispatch({
        type: POSITION_OUT_OF_POLYGON,
        payload: { positionOutOfLocation },
      });
    }
  } catch (error) {
    setError(dispatch)(true);
  }
};


export const trackGameState = (dispatch) => (state) => {
  const { userLocation: { latitude, longitude }, gameState: { currentFox } } = state;
  try {
    const timeStamp = moment().format(TIME_FORMAT);
    const currentLocationLatitude = `${latitude ? latitude.toFixed(2) : '-'}`;
    const currentLocationLongitude = `${longitude ? longitude.toFixed(2) : '-'}`;
    const currentFoxNumber = `${currentFox?.index}`;
    const currentFoxLatitude = `${currentFox?.coordinates.coordinates[0].toFixed(2)}`;
    const currentFoxLongitude = `${currentFox?.coordinates.coordinates[1].toFixed(2)}`;
    let distanceToCurrentFox = distanceBetweenTwoPoints(
      [latitude, longitude],
      currentFox?.coordinates.coordinates,
      METERS_IN_KILOMETER,
    ) - DEFAULT_USER_RADIUS_FOR_SINGLE_COMPETITIONS;
    distanceToCurrentFox = distanceToCurrentFox >= 0 ? distanceToCurrentFox : 0;
    const currentLtLn = `${currentLocationLatitude}/${currentLocationLongitude}`;
    const foxLtLn = `${currentFoxLatitude}/${currentFoxLongitude}`;
    const newScv = [
      timeStamp,
      currentLtLn,
      distanceToCurrentFox,
      foxLtLn,
      currentFoxNumber,
      '\n',
    ];
    const scv = JSON.parse(JSON.stringify(state.scv));
    scv.push(newScv);
    dispatch({
      type: TRACK_GAME_STATE,
      payload: { scv },
    });
  } catch (error) {
    setError(dispatch)(true);
  }
};

export const storeGameState = (dispatch) => async (state) => {
  try {
    await clearScvFolder();
    await saveToFile(state.scv.join(''));
  } catch (err) {
    setError(dispatch)(true);
  }
};

