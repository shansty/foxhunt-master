import { UserFeedbackAction } from '../../types/Actions';
import { UserFeedbackState } from '../../types/States';
import { UserFeedbackActionTypes } from '../actions/types/userFeedbackActionTypes';

const initialState: UserFeedbackState = {
  userFeedbacks: new Map(),
  userFeedbackAllSize: new Map(),
  isLoading: true,
  error: null,
};

export default function userFeedbackReducer(
  state = initialState,
  action: UserFeedbackAction,
): UserFeedbackState {
  switch (action.type) {
    case UserFeedbackActionTypes.fetch.request:
    case UserFeedbackActionTypes.create.request:
      return {
        ...state,
        isLoading: true,
      };
    case UserFeedbackActionTypes.fetch.success: {
      const userFeedbacks = action.payload.userFeedbacks;
      const organizationId = action.payload.organizationId;
      const allSize = action.payload.size;
      return {
        ...state,
        userFeedbacks: state.userFeedbacks.set(organizationId, userFeedbacks),
        userFeedbackAllSize: state.userFeedbackAllSize.set(
          organizationId,
          allSize,
        ),
        isLoading: false,
        error: null,
      };
    }
    case UserFeedbackActionTypes.update.success:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case UserFeedbackActionTypes.fetch.failure:
    case UserFeedbackActionTypes.create.failure:
    case UserFeedbackActionTypes.update.failure:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
