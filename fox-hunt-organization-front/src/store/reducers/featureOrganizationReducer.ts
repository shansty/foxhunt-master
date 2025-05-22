import { FeatureOrganizationAction } from '../../types/Actions';
import { featureOrganizationState } from '../../types/States';
import { FeatureOrganizationActionTypes } from '../actions/types/featureOrganizationActionTypes';

const initialState: featureOrganizationState = {
  featureOrganizations: [],
  isLoading: true,
  error: null,
};

export default function featureOrganizationReducer(
  state = initialState,
  action: FeatureOrganizationAction,
): featureOrganizationState {
  switch (action.type) {
    case FeatureOrganizationActionTypes.fetch.request:
      return {
        ...state,
        isLoading: true,
      };
    case FeatureOrganizationActionTypes.fetch.failure:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case FeatureOrganizationActionTypes.fetch.success:
      return {
        featureOrganizations: action.payload.map((el: any) => {
          el.featureOrganizations = new Map(
            el.featureOrganizations.map(({ id, isEnabled }: any) => [
              id,
              isEnabled,
            ]),
          );
          return el;
        }),
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
