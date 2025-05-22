import {
  COMMAND_COMPETITION_PROCESS,
  COMMAND_COMPETITION_RESULT_SCREEN,
  COMMAND_COMPETITIONS,
} from '../../../../utils/constants/routeNames';
import {
  SET_COMPETITION,
  SET_COMPETITIONS,
  SET_GAME_STATE,
  SET_TRACKER_DEVICE,
  SWITCH_IS_LOADING,
  TOGGLE_IS_FOX_FOUND,
  UPDATE_GAME_ACTIVE_FOX,
  UPDATE_GAME_LOCATION,
  UPDATE_GAME_RESULT,
} from '../../../../utils/constants/mainActionTypes';
import {
  DEFAULT_EDGES_AMOUNT,
  DEFAULT_USER_RADIUS_FOR_COMMAND_COMPETITIONS,
  LATITUDE_INDEX,
  LONGITUDE_INDEX,
} from '../../../../utils/constants/commonConstants';
import { OUT_OF_POLYGON_NOTIFICATION } from '../../../../utils/constants/notificationType';
import { navigate } from '../../../../navTools/rootNavigation';
import { activeCompetitionApi } from '../../../../api/competitionApi';
import { getEmailFromAsyncStore, getTokenFromAsyncStore } from '../../../../api/utils/tokenUtils';
import { circleToPolygonConverter } from '../../../../utils/mapUtils';
import { setError } from './CompetitionActions';
import RNEventSource from 'react-native-event-source';
import { ACTIVE_FOX_EVENT, CURRENT_LOCATION_EVENT } from '../../../../utils/constants/sseTypes';
import { convertToSseURL } from '../../../../utils/constants/sseURL';

export const setCompetitions = (dispatch) => async () => {
  try {
    navigate(COMMAND_COMPETITIONS);
    const competitions = await activeCompetitionApi.get('/active');
    const email = await getEmailFromAsyncStore();
    dispatch({
      type: SET_COMPETITIONS,
      payload: { competitions: competitions.data, email: email },
    });
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
  } catch (error) {
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
    setError(dispatch)(true);
    navigate(COMMAND_COMPETITIONS);
    console.log(error);
  }
};

export const initializeCommandCompetition = (dispatch) => async (id, startUserLocation) => {
  try {
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: true,
    });
    const email = await getEmailFromAsyncStore();
    const initCompetition = await activeCompetitionApi.get(`/active/${id}`);
    const foxPoints = initCompetition.data.foxPoints.map((point) => {
      return {
        ...point,
        catchingArea: circleToPolygonConverter(
          [point.coordinates.coordinates[LONGITUDE_INDEX],
            point.coordinates.coordinates[LATITUDE_INDEX]],
          DEFAULT_USER_RADIUS_FOR_COMMAND_COMPETITIONS,
          DEFAULT_EDGES_AMOUNT,
        ),
      };
    });
    const competition = {
      ...initCompetition.data,
      finishDate: initCompetition.data.participants.find((participant) =>
        participant.email === email).finishDate,
      foxPoints: foxPoints,
      center: {
        latitude: initCompetition.data.location.center.coordinates[LATITUDE_INDEX],
        longitude: initCompetition.data.location.center.coordinates[LONGITUDE_INDEX],
      },
      startUserLocation: startUserLocation,
    };

    dispatch({
      type: SET_COMPETITION,
      payload: {
        competition,
      },
    });
    return competition;
  } catch (error) {
    setError(dispatch)(true);
    console.log(error);
  }
};
export const createSseConnection =()=> async (competition) => {
  const token = await getTokenFromAsyncStore();
  return new RNEventSource(
    convertToSseURL(competition.id),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'text/event-stream',
      },
    },
  );
};

export const listenEvents = (dispatch) => async (source, competition) =>{
  source.addEventListener(ACTIVE_FOX_EVENT, ({ data }) => {
    updateActiveFox(dispatch)(data, competition);
  });
  source.addEventListener(CURRENT_LOCATION_EVENT, ({ data }) => {
    updateLocationGame(dispatch)(data);
  });
};

export const createConnection = (dispatch) => async (competition) => {
  try {
    const eventSource = await createSseConnection()(competition);
    await listenEvents(dispatch)(eventSource, competition);
    return eventSource;
  } catch (e) {
    setError(dispatch)(true);
    console.log(e);
  }
};
export const removeConnection = () => async (eventSource) => {
  try {
    eventSource.removeAllListeners();
    eventSource.close();
    await activeCompetitionApi.delete('/subscription');
  } catch (error) {
    console.log(error);
  }
};
export const setGameState = (dispatch) => async (competition)=>{
  const email = await getEmailFromAsyncStore();
  const gameState = await activeCompetitionApi.get(`/${competition.id}`);
  dispatch({
    type: SET_GAME_STATE,
    payload: {
      gameState: {
        ...gameState.data,
        foundFoxes: gameState.data.results
          .find((result) => result.user.email === email).foundFoxes,
        currentFox: competition.foxPoints.find((fox) =>
          fox.index === gameState.data.activeCompetition.activeFoxIndex),
      },
    },
  });
  return gameState;
};

export const startCommandCompetition = (dispatch) => async (competition) => {
  try {
    const email = await getEmailFromAsyncStore();
    const gameState = await setGameState(dispatch)(competition);
    const result = gameState.data.results.find((result) => result.user.email === email).foundFoxes;
    if (competition.foxAmount === result || gameState.data.results[0].finishDate) {
      navigate(COMMAND_COMPETITION_RESULT_SCREEN);
    } else {
      navigate(COMMAND_COMPETITION_PROCESS);
    }
  } catch (e) {
    setError(dispatch)(true);
  }
};

export const updateCompetitionResult = (dispatch) => async (trackDevice) => {
  try {
    dispatch({
      type: UPDATE_GAME_RESULT,
      payload: trackDevice.data.foxPoint,
    });
    dispatch({
      type: TOGGLE_IS_FOX_FOUND,
      payload: true,
    });
    setTimeout(() => {
      dispatch({
        type: TOGGLE_IS_FOX_FOUND,
        payload: false,
      });
    }, 5000);
  } catch (error) {
    setError(dispatch)(true);
    console.log(error);
  }
};
export const updateActiveFox = (dispatch) => async (data, competition) => {
  dispatch({
    type: UPDATE_GAME_ACTIVE_FOX,
    payload: { data: JSON.parse(data), competition },
  });
};
export const updateLocationGame = (dispatch) => async (data) =>{
  dispatch({
    type: UPDATE_GAME_LOCATION,
    payload: JSON.parse(data),
  });
};

export const setTrackerInfo = (dispatch) => async (id, coordinates) => {
  try {
    const trackDevice = await activeCompetitionApi.post(`/${id}/track`, coordinates);
    const positionOutOfLocation = trackDevice.data.notificationType === OUT_OF_POLYGON_NOTIFICATION;
    if (trackDevice.data.foxPoint) {
      updateCompetitionResult(dispatch)(trackDevice);
    }
    dispatch({
      type: SET_TRACKER_DEVICE,
      payload: {
        trackDevice: trackDevice.data,
        positionOutOfLocation: positionOutOfLocation,
      },
    });
  } catch (error) {
    setError(dispatch)(true);
  }
};
export const finishParticipant = (dispatch) => async (state) => {
  try {
    const activeLocation = {
      coordinates: {
        coordinates: [state.userLocation.latitude, state.userLocation.longitude],
        type: 'Point',
      },
    };
    await activeCompetitionApi.post(`/${state.competition.id}/participant/finish`, activeLocation);
    setGameState(dispatch)(state.competition);
  } catch (e) {
    console.log(e);
  }
};
export const finishCommandCompetition = (dispatch) => async (eventSource, state) => {
  try {
    await finishParticipant(dispatch)(state);
    removeConnection(dispatch)(eventSource);
  } catch (error) {
    console.log(error);
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: { isLoading: false },
    });
    setError(dispatch)(true);
    console.log(error);
  }
};
