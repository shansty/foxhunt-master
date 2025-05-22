import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { ID_COMPETITION } from 'src/store/constants/commonConstants';
export const competitionIdSelector = (state, props) => {
  const id = _.get(props, ['match', 'params', 'id']) || _.get(props, ['id']);
  return id ? id : ID_COMPETITION;
};

export const competitionsStateSelector = (state) => {
  return state.competitionsReducer;
};

export const selectAllCompetitions = createSelector(
  competitionsStateSelector,
  (state) => _.map(state.competitions, (competition) => competition),
);

export const selectCompetitionIsLoading = (state) =>
  state.competitionsReducer.isLoading;

export const selectAllCompetitionsCount = (state) =>
  state.competitionsReducer.size;

export const selectCompetition = createSelector(
  competitionIdSelector,
  competitionsStateSelector,
  (id, state) => {
    return state.competitions[id];
  },
);

export const selectCompetitionLoadingState = (state) =>
  state.competitionsReducer.isLoading;

export const selectAllCurrentCompetitions = (state) =>
  state.competitionsReducer.currentCompetitions;

export const selectAllCompetitionInvitations = createSelector(
  competitionsStateSelector,
  (state) => _.map(state.invitations, (competition) => competition),
);

export const selectGameState = (state) => state.competitionsReducer.gameState;

export const selectGameResults = (state) =>
  state && state.competitionsReducer.gameState.results
    ? state.competitionsReducer.gameState.results
    : [];

export const selectCompetitionTemplates = (state) =>
  state.competitionsReducer.competitionTemplates;
