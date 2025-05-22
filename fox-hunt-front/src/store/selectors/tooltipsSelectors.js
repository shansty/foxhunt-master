export const tooltipsSelector = (state) => state.tooltipsReducer;

export const selectAllTooltips = (state) => state.tooltipsReducer.tooltips;

export const selectTooltipError = (state) => state.tooltipsReducer.error;

export const selectTooltipLoadingState = (state) =>
  state.tooltipsReducer.isLoading;

export const selectNotCreatedTooltips = (state) =>
  state.tooltipsReducer.notCreatedTooltips;
