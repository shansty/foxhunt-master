import { FEATURES } from '../store/constants/localStorageKeys';

export const isFeatureEnabled = (featureName) => {
  const features = JSON.parse(localStorage.getItem(FEATURES));
  if (!features) {
    return false;
  }
  return features.some((feature) => feature === featureName);
};
