import createDataContext from './createDataContext';
import {
  CLEAR_RESULTS_DATA,
  SET_ACTIVE_TAB,
  SET_COMMAND_RESULTS,
  SET_FEEDBACK,
  SET_HELP_PAGES,
  SET_IS_LAST_PAGE,
  SET_IS_LOADING,
  SET_TOOLTIPS, TOGGLE_NOTIFICATION,
} from '../utils/constants/commonActionTypes';
import { HOME_PAGE } from '../utils/constants/routeNames';
import helpContentApi from '../api/helpContentApi';
import tooltipApi from '../api/tooltipApi';
import { convertArrayToMap } from '../utils/commonUtils';
import commandCompetitionResultsApi from '../api/resultsApi';
import { NUMBER_OF_CARDS_IN_RESULT_PAGE } from '../utils/constants/commonConstants';
import { feedbackApi } from '../api/feedbackApi';


const commonReducer = (state, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    case SET_HELP_PAGES:
      return {
        ...state,
        isLoading: false,
        helpPages: action.payload,
      };
    case SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_TOOLTIPS:
      return { ...state, tooltips: action.payload };
    case SET_FEEDBACK:
      return { ...state, feedback: action.payload };
    case SET_COMMAND_RESULTS:
      return { ...state, results: [...state.results, ...action.payload] };
    case SET_IS_LAST_PAGE:
      return { ...state, lastResultsPage: action.payload };
    case CLEAR_RESULTS_DATA:
      return { ...state, results: action.payload };
    case TOGGLE_NOTIFICATION:
      return { ...state, isOpenNotification: action.payload };
    default:
      return state;
  }
};
const changeIsLoading = (dispatch) => () => {
  dispatch({
    type: SET_IS_LOADING,
    payload: true,
  });
};

const setActiveTab = (dispatch) => (routeName) => {
  dispatch({
    type: SET_ACTIVE_TAB,
    payload: routeName,
  });
};

const getHelpPagesDescription = (dispatch) => async () => {
  try {
    const helpPagesAndDescriptions = await helpContentApi.get();
    dispatch({
      type: SET_HELP_PAGES,
      payload: helpPagesAndDescriptions.data,
    });
    dispatch({
      type: SET_IS_LOADING,
      payload: false,
    });
  } catch (error) {
    console.log(error);
  }
};
const setTooltips = (dispatch) => async () => {
  try {
    const tooltips = await tooltipApi.get();
    const tooltipsMap = convertArrayToMap(tooltips.data);
    dispatch({
      type: SET_TOOLTIPS,
      payload: tooltipsMap,
    });
  } catch (error) {
  }
};
const setFeedback = (dispatch) => (feedback) => {
  try {
    dispatch({
      type: SET_FEEDBACK,
      payload: feedback,
    });
  } catch (error) {
    console.log(error);
  }
};

const fetchInitialCommandResults = (dispatch) => async (page)=> {
  try {
    await fetchCommandResults(dispatch)(page);
    dispatch({
      type: SET_IS_LOADING,
      payload: false,
    });
  } catch (e) {
    console.log(e);
  }
};
const fetchCommandResults = (dispatch) => async (page) =>{
  try {
    const params = { page, size: NUMBER_OF_CARDS_IN_RESULT_PAGE };
    const response = await commandCompetitionResultsApi.get('/', {
      params,
    });
    if (response.data.totalPages === page) {
      dispatch({
        type: SET_IS_LAST_PAGE,
        payload: true,
      });
    }
    dispatch({
      type: SET_COMMAND_RESULTS,
      payload: response.data.content,
    });
  } catch (e) {
    console.log(e);
  }
};
const clearCommandResult = (dispatch) => async ()=>{
  dispatch({
    type: CLEAR_RESULTS_DATA,
    payload: [],
  });
  dispatch({
    type: SET_IS_LAST_PAGE,
    payload: false,
  });
};

const getUserFeedback = (dispatch) => async ()=>{
  try {
    const response = await feedbackApi.get();
    const responseLength = response.data.length;
    const feedback = response.data[responseLength - 1];
    dispatch({
      type: SET_IS_LOADING,
      payload: false,
    });
    if (feedback) {
      setFeedback(dispatch)(feedback);
      return feedback;
    } else {
      setFeedback(dispatch)({});
      return {};
    }
  } catch (e) {
    console.log(e);
  }
};
const createFeedBack = () => async (userFeedback) => {
  try {
    const response = await feedbackApi.post('', userFeedback);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
const updateFeedBack = () => async (userFeedback) => {
  try {
    await feedbackApi.put('', userFeedback);
  } catch (e) {
    console.log(e);
  }
};

const toggleNotification = (dispatch) => () => {
  dispatch({
    type: TOGGLE_NOTIFICATION,
    payload: true,
  });
  dispatch({
    type: TOGGLE_NOTIFICATION,
    payload: false,
  });
};
export const { Provider, Context } = createDataContext(
  commonReducer,
  {
    setActiveTab,
    getHelpPagesDescription,
    setTooltips,
    setFeedback,
    fetchCommandResults,
    clearCommandResult,
    fetchInitialCommandResults,
    changeIsLoading,
    getUserFeedback,
    createFeedBack,
    updateFeedBack,
    toggleNotification,
  },
  {
    isLoading: true,
    activeTab: HOME_PAGE,
    tooltips: setTooltips(),
    feedback: {},
    results: [],
    lastResultsPage: false,
    isOpenNotification: false,
  },
);
