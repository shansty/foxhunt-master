import { AllUsersAction } from '../../types/Actions';
import { User } from '../../types/AllUsers';
import { AllUsersState } from '../../types/States';
import {
  AllUsersActionTypes,
  BanUnbanActionTypes,
} from '../actions/types/allUsersActionTypes';

const initialState: AllUsersState = {
  allUsers: [],
  isLoading: true,
  error: null,
};

export default function allUsersReducer(
  state = initialState,
  action: AllUsersAction,
): AllUsersState {
  switch (action.type) {
    case AllUsersActionTypes.fetch.request:
    case AllUsersActionTypes.update.request:
    case AllUsersActionTypes.create.request:
      return {
        ...state,
        isLoading: true,
      };
    case AllUsersActionTypes.fetch.success: {
      const allUsers = action.payload;
      return {
        ...state,
        allUsers,
        isLoading: false,
        error: null,
      };
    }
    case AllUsersActionTypes.update.success: {
      const payload = action.payload;
      const allUsers = state.allUsers.map((item: User) => {
        return item.id === payload.id ? payload : item;
      });
      return {
        ...state,
        allUsers,
        isLoading: false,
        error: null,
      };
    }
    case AllUsersActionTypes.create.success: {
      const payload = action.payload;
      const allUsers = state.allUsers
        .concat(payload)
        .sort((first: User, second: User) =>
          first.id && second.id && first.id < second.id ? -1 : 1,
        );
      return {
        ...state,
        allUsers,
        isLoading: false,
        error: null,
      };
    }
    case BanUnbanActionTypes.fetch.success: {
      const meta = action.meta;
      const id = Number(meta);
      const allUsers = state.allUsers.map((item) => {
        if (item.id === id) {
          item.banned = !item.banned;
        }
        return item;
      });

      return {
        ...state,
        allUsers,
      };
    }
    case AllUsersActionTypes.fetch.failure:
    case AllUsersActionTypes.create.failure:
    case AllUsersActionTypes.update.failure:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
