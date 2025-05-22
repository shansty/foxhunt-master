// the function takes action type and creates a key from it.
// for instance:
// feature/loadAvailableFeatures/pending => loadAvailableFeaturesLoading;
// feature/loadAvailableFeatures/rejected => loadAvailableFeaturesError;

export const createKey = (actionType: string, fieldTypeName: string) => {
  const stringArray = actionType.split('/');
  const key = `${stringArray[1]}${fieldTypeName}`;
  return key;
};

// the function takes action type and creates an initial action type
// for instance:
// feature/loadAvailableFeatures/pending => feature/loadAvailableFeature;
// feature/loadAvailableFeatures/rejected => feature/loadAvailableFeatures/rejected;

export const createInitialType = (actionType: string) => {
  return actionType.split('/').slice(0, -1).join('/');
};
