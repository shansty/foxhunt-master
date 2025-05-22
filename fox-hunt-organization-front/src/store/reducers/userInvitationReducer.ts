import { UserInvitationAction } from '../../types/Actions';
import { Invitation } from '../../types/Invitation';
import { UserInvitationState } from '../../types/States';
import { UserInvitationActionTypes } from '../actions/types/userInvitationActionTypes';

const initialState: UserInvitationState = {
  userInvitations: [],
  isLoading: true,
  error: null,
};

export default function userInvitationReducer(
  state = initialState,
  action: UserInvitationAction,
): UserInvitationState {
  switch (action.type) {
    case UserInvitationActionTypes.fetch.request:
    case UserInvitationActionTypes.update.request:
    case UserInvitationActionTypes.create.request:
      return {
        ...state,
        isLoading: true,
      };
    case UserInvitationActionTypes.fetch.success: {
      const userInvitations = action.payload;
      return {
        ...state,
        userInvitations: userInvitations,
        isLoading: false,
        error: null,
      };
    }
    case UserInvitationActionTypes.update.success: {
      const updatedUserInvitation = action.payload;
      const userInvitationsAfterUpdate = state.userInvitations.map(
        (item: Invitation) => {
          return item.userInvitationId ===
            updatedUserInvitation.userInvitationId
            ? updatedUserInvitation
            : item;
        },
      );
      return {
        ...state,
        userInvitations: userInvitationsAfterUpdate,
        isLoading: false,
        error: null,
      };
    }
    case UserInvitationActionTypes.create.success: {
      const createdUserInvitation = action.payload;
      const userInvitationsAfterCreate = state.userInvitations
        .concat(createdUserInvitation)
        .sort((firstInvitation: Invitation, secondInvitation: Invitation) =>
          firstInvitation.name &&
          secondInvitation.name &&
          firstInvitation.name < secondInvitation.name
            ? -1
            : 1,
        );
      return {
        ...state,
        userInvitations: userInvitationsAfterCreate,
        isLoading: false,
        error: null,
      };
    }
    case UserInvitationActionTypes.fetch.failure:
    case UserInvitationActionTypes.create.failure:
    case UserInvitationActionTypes.update.failure:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
