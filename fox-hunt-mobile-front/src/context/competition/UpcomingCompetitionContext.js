import {
  SET_UPCOMING_COMPETITIONS,
  SET_CURRENT_COMPETITION,
  SET_ERROR,
  SWITCH_IS_LOADING,
} from '../../utils/constants/mainActionTypes';
import createDataContext from '../createDataContext';
import { navigate } from '../../navTools/rootNavigation';
import { competitionApi } from '../../api/competitionApi';
import { UPCOMING_COMPETITIONS, COMPETITIONS_DESCRIPTION } from '../../utils/constants/routeNames';

const UpcomingCompetitionReducer = (state, action) => {
  switch (action.type) {
    case SET_UPCOMING_COMPETITIONS:
      return {
        ...state,
        competitions: action.payload,
        isLoading: false,
      };
    case SET_CURRENT_COMPETITION:
      return {
        ...state,
        currentCompetition: action.payload,
        isLoading: false,
      };
    case SWITCH_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
      };
    case 'CLEAR_DATA':
      return {
        ...state,
        currentCompetition: null,
      };
    default:
      return state;
  }
};

const setAllCompetitions = async (dispatch) => {
  try {
    const competitions = await competitionApi.get(
      '?projection=CompetitionWithInvitationInfo&status=SCHEDULED',
    );
    dispatch({
      type: SET_UPCOMING_COMPETITIONS,
      payload: competitions.data.content,
    });
  } catch (error) {
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
    console.log(error);
  }
};

const setCompetitions = (dispatch) => async () => {
  try {
    navigate(UPCOMING_COMPETITIONS);
    await setAllCompetitions(dispatch);
  } catch (error) {
    navigate(UPCOMING_COMPETITIONS);
  }
};

const setCurrentCompetition = (dispatch) => async (competitionId, invitationStatus, source) => {
  try {
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: true,
    });
    const currentCompetition = await competitionApi.get(`/${competitionId}`);
    dispatch({
      type: SET_CURRENT_COMPETITION,
      payload: { ...currentCompetition.data, invitationStatus, source },
    });
    dispatch({
      type: SET_ERROR,
      payload: '',
    });
    navigate(COMPETITIONS_DESCRIPTION);
  } catch (error) {
    navigate(UPCOMING_COMPETITIONS);
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
    console.log(error);
  }
};

const subscribeToCompetition = (dispatch) => async (competitionId) => {
  try {
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: true,
    });
    await competitionApi.post(`/${competitionId}/subscription`, {});
    await setAllCompetitions(dispatch);
    navigate(UPCOMING_COMPETITIONS);
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: SET_ERROR,
      payload: error.message,
    });
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
  }
};

const acceptCompetitionInvite = (dispatch) => async (competitionId) => {
  try {
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: true,
    });
    await competitionApi.put(`/${competitionId}/invitation/accept`, {});
    await setAllCompetitions(dispatch);
    navigate(UPCOMING_COMPETITIONS);
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
    dispatch({
      type: SET_ERROR,
      payload: error.message,
    });
  }
};

const declineInvitation = (dispatch) => async (competitionId) => {
  try {
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: true,
    });
    await competitionApi.put(`/${competitionId}/invitation/decline`, {});
    await setAllCompetitions(dispatch);
    navigate(UPCOMING_COMPETITIONS);
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
    dispatch({
      type: SET_ERROR,
      payload: error.message,
    });
  }
};

const leaveTheCompetition = (dispatch) => async (competitionId) => {
  try {
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: true,
    });
    await competitionApi.delete(`/${competitionId}/participants`, {});
    await setAllCompetitions(dispatch);
    navigate(UPCOMING_COMPETITIONS);
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: SWITCH_IS_LOADING,
      payload: false,
    });
    dispatch({
      type: SET_ERROR,
      payload: error.message,
    });
  }
};

const setError = (dispatch) => (errorMessage) => {
  console.log(errorMessage);
  dispatch({
    type: SET_ERROR,
    payload: errorMessage,
  });
};

export const { Provider, Context } = createDataContext(
  UpcomingCompetitionReducer,
  {
    setCompetitions,
    setCurrentCompetition,
    subscribeToCompetition,
    acceptCompetitionInvite,
    declineInvitation,
    leaveTheCompetition,
    setError,
  },
  {
    competitions: [],
    currentCompetition: {},
    isLoading: true,
    errorMessage: '',
  },
);
