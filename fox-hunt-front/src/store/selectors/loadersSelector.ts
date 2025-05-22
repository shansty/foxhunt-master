import { RootState } from 'src/store/typings/root';

export const locationsLoaderSelector = (state: RootState) => {
  return state.loadersReducer.getLocationsLoading;
};

export const locationLoaderSelector = (state: RootState) => {
  return state.loadersReducer.getLocationByIdLoading;
};

export const userLoaderSelector = (state: RootState) => {
  return state.loadersReducer.loadLoggedUserInfoLoading;
};

export const competitionLoaderSelector = (state: RootState) => {
  return state.loadersReducer.getCompetitionByIdLoading;
};

export const competitionsLoaderSelector = (state: RootState) => {
  return state.loadersReducer.getCompetitionsLoading;
};

export const currentCompetitionsLoaderSelector = (state: RootState) => {
  return state.loadersReducer.getCurrentCompetitionsLoading;
};

export const competitionByDateLoaderSelector = (state: RootState) => {
  return state.loadersReducer.getCompetitionByDateLoading;
};

export const competitionByPageLoaderSelector = (state: RootState) => {
  return state.loadersReducer.getCompetitionByDateLoading;
};

export const innerAppLoaderSelector = (state: RootState) => {
  const { loadLoggedUserInfoLoading, userAuthenticationLoading } =
    state.loadersReducer;
  return loadLoggedUserInfoLoading || userAuthenticationLoading;
};

export const declineInvitationLoaderSelector = (state: RootState) => {
  const { isInvitationValidLoading, checkIfUserIsAuthorisedLoading } =
    state.loadersReducer;
  return isInvitationValidLoading || checkIfUserIsAuthorisedLoading;
};
