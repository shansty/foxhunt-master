import { Action } from '../../types/Actions';
import { RoleState } from '../../types/States';
import { RoleActionTypes } from '../actions/types/roleActionTypes';

const initialState: RoleState = {
  roles: [],
  isLoading: true,
  error: null,
};

export default function (state = initialState, action: Action<any>): RoleState {
  switch (action.type) {
    case RoleActionTypes.fetch.request:
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}
