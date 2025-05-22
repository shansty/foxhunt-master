import { createSelector } from '@reduxjs/toolkit';
import { map } from 'lodash';

export const participantsStateSelector = (state) => state.participantsReducer;

export const selectAllParticipants = createSelector(
  participantsStateSelector,
  (state) => map(state.participants, (participant) => participant),
);

export const selectAllCoaches = createSelector(
  participantsStateSelector,
  (state) => map(state.coaches, (coaches) => coaches),
);

export const selectParticipantLoadingState = (state) =>
  state.participantsReducer.isLoading;
