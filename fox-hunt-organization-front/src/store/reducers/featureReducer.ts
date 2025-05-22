import { Feature } from '../../types/Feature';
import { FeatureAction } from '../../types/Actions';
import { FeatureState } from '../../types/States';
import { FeatureActionTypes } from '../actions/types/featureActionTypes';

const initialState: FeatureState = {
  features: [],
  isLoading: true,
  error: null,
};

const getUpdatedFeatures = (state: FeatureState, action: FeatureAction) => {
  const updatedFeature = action.payload;
  return state.features?.map((feature: Feature) => {
    if (feature.id.toString() !== updatedFeature.feature_id.toString()) {
      return feature;
    }
    return { ...feature, description: updatedFeature.description };
  });
};

export default function featureReducer(
  state = initialState,
  action: FeatureAction,
): FeatureState {
  switch (action.type) {
    case FeatureActionTypes.fetch.request:
    case FeatureActionTypes.update.request:
      return {
        ...state,
        isLoading: true,
      };
    case FeatureActionTypes.update.success:
      return {
        ...state,
        features: getUpdatedFeatures(state, action),
        isLoading: false,
        error: null,
      };
    case FeatureActionTypes.fetch.failure:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case FeatureActionTypes.fetch.success:
      return {
        features: action.payload,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
