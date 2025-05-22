export const helpContentSelector = (state) => state.helpContentReducer;

export const selectAllHelpContents = (state) =>
  state.helpContentReducer.helpContents;

export const selectHelpContentLoadingState = (state) =>
  state.helpContentReducer.isLoading;
