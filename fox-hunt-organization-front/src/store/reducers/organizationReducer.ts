import { OrganizationAction } from '../../types/Actions';
import { OrganizationState } from '../../types/States';
import { OrganizationActionTypes } from '../actions/types/organizationActionTypes';

const initialState: OrganizationState = {
  organizations: [],
  isLoading: true,
  error: null,
};

export default function organizationReducer(
  state = initialState,
  action: OrganizationAction,
): OrganizationState {
  switch (action.type) {
    case OrganizationActionTypes.fetch.request:
    case OrganizationActionTypes.create.request:
    case OrganizationActionTypes.update.request:
    case OrganizationActionTypes.fetchById.request:
      return {
        ...state,
        isLoading: true,
      };
    case OrganizationActionTypes.create.success:
    case OrganizationActionTypes.update.success:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case OrganizationActionTypes.create.failure:
    case OrganizationActionTypes.fetch.failure:
    case OrganizationActionTypes.update.failure:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case OrganizationActionTypes.changeOrgStatus.success: {
      const organizations = state.organizations;
      const changedOrganization = organizations.find(
        (organization) => organization.id == action.payload.id,
      );
      if (changedOrganization)
        changedOrganization.status = action.payload.status;
      return {
        ...state,
        organizations,
      };
    }
    case OrganizationActionTypes.fetch.success:
      return {
        organizations: action.payload.sort(
          (
            firstOrganization: { name: string },
            secondOrganization: { name: string },
          ) => (firstOrganization.name < secondOrganization.name ? -1 : 1),
        ),
        isLoading: false,
        error: null,
      };
    case OrganizationActionTypes.fetchById.success:
      return {
        ...state,
        organization: action.payload,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
