export const distanceTypesStateSelector = (state) => state.distanceTypesReducer;

export const selectDistanceTypes = (state) =>
  state.distanceTypesReducer.distanceTypes;

export const selectErrorState = (state) => state.distanceTypesReducer.error;
