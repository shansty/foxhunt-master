import createDataContext from './createDataContext';
import loginApi from '../api/loginApi';
import usersApi from '../api/usersApi';
import organizationApi from '../api/organizationApi';
import { navigate } from '../navTools/rootNavigation';
import { googleSignIn, googleSignOut } from '../googleServices/googleAuth';
import {
  ADD_ERROR,
  CLEAR_ERROR_MESSAGE,
  SET_DOMAIN,
  SET_USER_DATA,
  SIGN_IN,
  SIGN_IN_FAILED,
  SIGN_OUT,
  UPDATE_PASSWORD,
} from '../utils/constants/authActionTypes';
import {
  getTokenFromAsyncStore,
  removeJwtFromAsyncStore,
  saveJwtRespToAsyncStore,
} from '../api/utils/tokenUtils';
import { SIGN_IN_OPTIONS } from '../utils/constants/routeNames';
import { ERROR_NUMBER_400, ERROR_NUMBER_401 } from '../utils/constants/errors';

const authReducer = (state, action) => {
  switch (action.type) {
    case ADD_ERROR:
      return { ...state, errorMessage: action.payload };
    case SET_DOMAIN:
      return { ...state, currentDomain: action.payload };
    case SET_USER_DATA:
      return { ...state, userData: action.payload };
    case SIGN_IN:
      return {
        ...state,
        errorMessage: '',
        isSignedIn: true,
        isLoading: false,
        isUserActivated: action.payload,
      };
    case SIGN_IN_FAILED:
      return {
        ...state,
        isSignedIn: false,
        isLoading: false,
      };
    case CLEAR_ERROR_MESSAGE:
      return { ...state, errorMessage: '' };
    case SIGN_OUT:
      return {
        ...state,
        token: null,
        errorMessage: '',
        isSignedIn: false,
        isUserActivated: null,
      };
    case UPDATE_PASSWORD:
      return {
        ...state,
      };
    default:
      return state;
  }
};

const tryLocalSignIn = (dispatch) => async () => {
  // Implement the refresh functionality of the token
  try {
    const accessToken = await getTokenFromAsyncStore();
    if (accessToken) {
      setTimeout(() => dispatch({ type: SIGN_IN }), 1000 );
      setCurrentUser(dispatch)();
    } else {
      setTimeout(() => dispatch({ type: SIGN_IN_FAILED }), 1000 );
    }
  } catch (error) {
    console.log(error);
  }
};

const setError = (dispatch) => (errorMessage) => {
  dispatch({
    type: ADD_ERROR,
    payload: errorMessage,
  });
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({
    type: CLEAR_ERROR_MESSAGE,
  });
};

const signInWithGoogle = (dispatch) => async (currentDomain) => {
  try {
    const userInfo = await googleSignIn();
    await removeJwtFromAsyncStore();
    dispatch({
      type: SET_USER_DATA,
      payload: userInfo,
    });
    const tokens = await loginApi.get(`/token?domain=${currentDomain}&code=${userInfo.serverAuthCode}`);
    await saveJwtRespToAsyncStore(tokens.data);
  } catch (error) {
    dispatch({
      type: ADD_ERROR,
      payload: error.message,
    });
  }
};

const signInWithEmail = (dispatch) => async (email, password, currentDomain) => {
  if (email && password) {
    try {
      const tokens = await loginApi.post('/authentication', {
        email,
        password,
        domain: currentDomain,
      });
      await saveJwtRespToAsyncStore(tokens.data, email);
      setCurrentUser(dispatch)();
    } catch (error) {
      let messageWithoutQuotes;
      switch (error.response.status) {
        case ERROR_NUMBER_401:
          messageWithoutQuotes = 'Wrong credentials';
          break;
        default:
          messageWithoutQuotes = 'Something went wrong';
          break;
      }
      dispatch({
        type: ADD_ERROR,
        payload: messageWithoutQuotes,
      });
    }
  } else {
    dispatch({
      type: ADD_ERROR,
      payload: 'All fields are required',
    });
  };
};

const setCurrentUser = (dispatch) => async () => {
  try {
    const user = await usersApi.get('/current-user');
    dispatch({
      type: SIGN_IN,
      payload: user.data.activatedSince,
    });
  } catch (e) {
    console.log(e);
  }
};

const setDomain = (dispatch) => async (currentDomain) => {
  if (currentDomain) {
    try {
      dispatch({
        type: CLEAR_ERROR_MESSAGE,
      });
      await organizationApi.head(`domain/${currentDomain}`);
      dispatch({
        type: SET_DOMAIN,
        payload: currentDomain,
      });
      navigate(SIGN_IN_OPTIONS);
    } catch (error) {
      let messageWithoutQuotes;
      switch (error.response.status) {
        case ERROR_NUMBER_400:
          messageWithoutQuotes = 'Such domain doesn\'t exist';
          break;
        case ERROR_NUMBER_401:
          messageWithoutQuotes = 'The service is currently unavailable, please try again later';
          break;
        default:
          messageWithoutQuotes = 'Something went wrong';
          break;
      }
      dispatch({
        type: ADD_ERROR,
        payload: messageWithoutQuotes,
      });
    }
  } else {
    dispatch({
      type: ADD_ERROR,
      payload: 'Type something, please',
    });
  }
};

const signOut = (dispatch) => async () => {
  try {
    const signOutInfo = await googleSignOut();
    console.log(signOutInfo);
    await removeJwtFromAsyncStore();
    dispatch({
      type: SIGN_OUT,
    });
  } catch (error) {
    console.log(error);
  }
};

const updatePassword = (dispatch) => async (
  oldPassword,
  newPassword,
  confirmNewPassword,
) => {
  if (oldPassword && newPassword && confirmNewPassword) {
    if (newPassword === oldPassword) {
      throw new Error('Old and new passwords must not match');
    };
    if (newPassword !== confirmNewPassword) {
      throw new Error(
        'The passwords you entered do not match. Check your typing and try again',
      );
    };
    try {
      await usersApi.patch('/change-password', {
        currentPassword: oldPassword,
        newPassword,
      });
    } catch (error) {
      switch (error.response.status) {
        case ERROR_NUMBER_400:
          throw new Error('Make sure your old password is correct');
        case ERROR_NUMBER_401:
          throw new Error('The service is currently unavailable, please try again later');
        default:
          throw new Error('Something went wrong');
      };
    }
  } else {
    throw new Error('All fields are required');
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    tryLocalSignIn,
    setError,
    clearErrorMessage,
    signInWithGoogle,
    signInWithEmail,
    setDomain,
    signOut,
    updatePassword,
    setCurrentUser,
  },
  {
    isSignedIn: false,
    isLoading: true,
  },
);
