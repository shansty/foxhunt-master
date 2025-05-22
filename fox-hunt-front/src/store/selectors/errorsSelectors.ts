import { RootState } from 'src/store/typings/root';

export const locationErrorSelector = (state: RootState) =>
  state.errorReducer.locationError;

export const locationsErrorSelector = (state: RootState) =>
  state.errorReducer.locationsError;

export const locationPackageErrorSelector = (state: RootState) =>
  state.errorReducer.locationPackageError;

export const locationPackagesErrorSelector = (state: RootState) =>
  state.errorReducer.locationPackagesError;

export const competitionErrorSelector = (state: RootState) =>
  state.errorReducer.competitionError;

export const competitionsErrorSelector = (state: RootState) =>
  state.errorReducer.competitionsError;

export const participantsErrorSelector = (state: RootState) =>
  state.errorReducer.participantsError;

export const userErrorSelector = (state: RootState) =>
  state.errorReducer.userError;

export const usersErrorSelector = (state: RootState) =>
  state.errorReducer.usersError;

export const featuresErrorSelector = (state: RootState) =>
  state.errorReducer.featuresError;

export const tooltipErrorSelector = (state: RootState) =>
  state.errorReducer.tooltipError;

export const distanceTypesErrorSelector = (state: RootState) =>
  state.errorReducer.distanceTypesError;

export const helpContentErrorSelector = (state: RootState) =>
  state.errorReducer.helpContentError;

export const trackersErrorSelector = (state: RootState) =>
  state.errorReducer.trackersError;

export const initialTrackersErrorSelector = (state: RootState) =>
  state.errorReducer.initialTrackersError;
