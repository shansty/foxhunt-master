import { Action } from 'redux';
import { AuthActionTypes } from '../actions/types/authActionTypes';
import { AuthState } from '../../types/States';

const initialState: AuthState = {
  isSignedIn: false,
  isLoading: false,
  error: null,
};

export default function authReducer(
  state = initialState,
  action: Action,
): AuthState {
  switch (action.type) {
    case AuthActionTypes.create.request:
      return {
        ...state,
        isLoading: true,
      };
    case AuthActionTypes.create.success:
      return {
        ...state,
        isLoading: false,
        isSignedIn: true,
      };
    case AuthActionTypes.create.failure:
      return {
        ...state,
        error: 'Incorrect credentials',
        isLoading: false,
      };
    case AuthActionTypes.logout:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
