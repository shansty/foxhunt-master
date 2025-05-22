import {
  CHANGE_CURRENT_FOX,
  CHANGE_USER_DIRECTION,
  CHANGE_USER_LOCATION,
  CLEAR_STATE,
  FINISH_PARTICIPATION,
  POSITION_OUT_OF_POLYGON,
  SET_CALCULATED_SOUND_LEVEL,
  SET_COMPETITION,
  SET_COMPETITIONS,
  SET_CURRENT_SOUND,
  SET_ERROR,
  SET_FOX_TIMER_ID,
  SET_FREQUENCY,
  SET_FREQUENCY_CLOSENESS,
  SET_GAME_STATE,
  SET_IS_FINISHED,
  SET_TRACKER_DEVICE,
  SET_VOLUME,
  START_COMPETITION,
  START_PARTICIPATION,
  SWITCH_IS_LOADING,
  TOGGLE_IS_FOX_FOUND,
  TRACK_GAME_STATE,
  UPDATE_FOUND_FOXES,
  UPDATE_FOX_POINTS,
  UPDATE_GAME_ACTIVE_FOX,
  UPDATE_GAME_LOCATION,
  UPDATE_GAME_RESULT,
} from '../../../utils/constants/mainActionTypes';
import { HALF_FREQUENCY_INTERVAL } from '../../../utils/constants/commonConstants';
import calculateAngleToPoint from '../../../utils/userLocation/calculateAngleToPoint';

export const CompetitionReducer = (state, action) => {
  const {
    email,
    competitions,
    competition,
    startOfCompetition,
    startOfParticipation,
    currentFox,
    soundInterval,
    gameState,
    longitude,
    latitude,
    observerId,
    positionOutOfLocation,
    volume,
    frequency,
    frequencyCloseness,
    currentSound,
    calculatedSoundLevel,
    isError,
    isLoading,
    foxTimerId,
    defaultState,
    scv,
    checkList,
  } = action.payload;

  switch (action.type) {
    case CLEAR_STATE:
      return {
        ...defaultState,
      };
    case SET_COMPETITIONS:
      return {
        ...state,
        email,
        competitions,
      };
    case SET_COMPETITION:
      return {
        ...state,
        competition,
        frequency: competition.frequency - HALF_FREQUENCY_INTERVAL,
      };
    case START_COMPETITION:
      return {
        ...state,
        startOfCompetition,
        gameState,
      };
    case SET_GAME_STATE:
      return {
        ...state,
        gameState,
      };
    case START_PARTICIPATION:
      return {
        ...state,
        startOfParticipation,
        soundInterval,
      };
    case CHANGE_USER_DIRECTION:
      if (state.userLocation.longitude && state.gameState.currentFox) {
        const angleToPoint = calculateAngleToPoint(
          state.userLocation,
          action.payload,
          state.gameState.currentFox,
        );
        return {
          ...state,
          userLocation: {
            ...state.userLocation,
            angleToPoint,
            angleToNorth: action.payload,
          },
        };
      } else {
        return state;
      }
    case CHANGE_USER_LOCATION:
      return {
        ...state,
        userLocation: {
          ...state.userLocation,
          longitude,
          latitude,
          observerId,
        },
      };
    case CHANGE_CURRENT_FOX:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          currentFox,
        },
      };
    case TOGGLE_IS_FOX_FOUND:
      return {
        ...state,
        isFound: action.payload,
      };
    case UPDATE_FOX_POINTS:
      return {
        ...state,
        competition: {
          ...state.competition,
          foxPoints: action.payload,
        },
      };
    case UPDATE_FOUND_FOXES:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          foundFoxes: action.payload,
        },
      };
    case POSITION_OUT_OF_POLYGON:
      return {
        ...state,
        positionOutOfLocation,
      };
    case SET_TRACKER_DEVICE:
      return {
        ...state,
        trackDevice: action.payload.trackDevice,
        positionOutOfLocation,
      };
    case SET_FOX_TIMER_ID:
      return {
        ...state,
        foxTimerId,
      };
    case FINISH_PARTICIPATION:
      return {
        ...state,
        checkList,
      };
    case TRACK_GAME_STATE:
      return {
        ...state,
        scv,
      };
    case SET_IS_FINISHED:
      return {
        ...state,
        isFinished: action.payload,
      };
    case SET_FREQUENCY:
      return {
        ...state,
        frequency,
        frequencyCloseness,
      };
    case SET_FREQUENCY_CLOSENESS:
      return {
        ...state,
        frequencyCloseness,
      };
    case SET_VOLUME:
      return {
        ...state,
        volume,
      };
    case SET_CALCULATED_SOUND_LEVEL:
      return {
        ...state,
        calculatedSoundLevel,
      };
    case SET_CURRENT_SOUND:
      return {
        ...state,
        currentSound,
      };
    case SWITCH_IS_LOADING:
      return {
        ...state,
        isLoading,
      };
    case SET_ERROR:
      return {
        ...state,
        isError,
      };
    case UPDATE_GAME_LOCATION:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          participantTrackers: action.payload,
        },
      };
    case UPDATE_GAME_RESULT:
      const result = state.competition.foxPoints.map((point)=>{
        if (point.id === action.payload.id) {
          return { ...point, isFound: true };
        }
        return { ...point };
      });
      return {
        ...state,
        competition: {
          ...state.competition,
          foxPoints: result,
        },
        foundFoxes: state.foundFoxes + 1,
      };
    case UPDATE_GAME_ACTIVE_FOX:

      return {
        ...state,
        gameState: {
          ...state.gameState,
          activeCompetition: action.payload.data,
          currentFox: action.payload.competition.foxPoints.find((fox) =>
            fox.index === action.payload.data.activeFoxIndex),
        },
      };
    default:
      return state;
  }
};
