import { UserAction } from '../../types/Actions';
import { UserState } from '../../types/States';
import { UserActionTypes } from '../actions/types/userActionTypes';

const initialState: UserState = {
  users: [],
  organizationUsers: [],
  isLoading: false,
  error: null,
};

export default function userReducer(
  state = initialState,
  action: UserAction,
): UserState {
  switch (action.type) {
    case UserActionTypes.create.request:
      return {
        ...state,
        isLoading: true,
      };
    case UserActionTypes.create.success: {
      const user = action.payload;
      return {
        ...state,
        users: [...state.users, user],
        isLoading: false,
        error: null,
      };
    }
    case UserActionTypes.create.failure:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case UserActionTypes.fetchUsers.success:
      return {
        ...state,
        organizationUsers: action.payload,
      };
    default:
      return state;
  }
}
