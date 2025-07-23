import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

import { ID_COMPETITION } from 'src/store/constants/commonConstants';
import { convertToCompetitionFromResponse } from 'src/api/utils/geometryConverter';
import {
  getCompetitions,
  getCurrentCompetitions,
  getCompetitionByDate,
  getCompetitionById,
  getAllInvitationsByCompetitionId,
  inviteToCompetitionByUserId,
  excludeFromCompetitionByUserId,
  declineInvitationToCompetitionByUserId,
  acceptInvitationToCompetitionByUserId,
  declineInvitationPermanently,
  removeCompetition,
  createCompetition,
  updateCompetition,
  startCompetition,
  finishCompetition,
  cancelCompetition,
  getGameState,
  createCompetitionFromTemplate,
} from 'src/store/actions/competitionActions';
import { ENTITY as competitions } from 'src/store/actions/types/competitionsTypes';
import type { CompetitionSliceState } from './types';

const initialState: CompetitionSliceState = {
  competitions: {},
  invitations: [],
  currentCompetitions: [],
  competitionTemplates: [
    { name: 'Foxoring TEST 3.5', id: '1' },
    { name: 'ARDF TEST 144', id: '2' },
  ],
  size: 0,
  gameState: {},
};

export const competitionSlice = createSlice({
  name: competitions,
  initialState,
  reducers: {
    changeCompetitionDate: (state, { payload }) => {
      const { competition, startDate } = payload;
      const newCompetition = {
        id: ID_COMPETITION,
        ...competition,
        startDate,
      };
      state.competitions = {
        ...state.competitions,
        [newCompetition.id]: newCompetition,
      };
    },
    changeCoordinateLocation: (state, { payload }) => {
      const { competition, location } = payload;
      const newCompetition = {
        id: ID_COMPETITION,
        ...competition,
        location,
      };
      state.competitions = {
        ...state.competitions,
        [newCompetition.id]: newCompetition,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentCompetitions.fulfilled, (state, { payload }) => {
        state.currentCompetitions = payload;
      })
      .addCase(
        acceptInvitationToCompetitionByUserId.fulfilled,
        (state, { payload }) => {
          state.invitations = payload;
        },
      )
      .addCase(declineInvitationPermanently.fulfilled, (state, { payload }) => {
        state.invitations = payload;
      })
      .addCase(
        removeCompetition.fulfilled,
        (state, action: PayloadAction<any, string>) => {
          state.competitions = _.omit(state.competitions, action.payload);
          state.size = state.size - 1;
        },
      )
      .addCase(
        createCompetitionFromTemplate.fulfilled,
        (state, { payload }) => {
          const newCompetition = payload;
          state.competitions = {
            ...state.competitions,
            [newCompetition.id]: newCompetition,
          };
        },
      )
      .addCase(getGameState.fulfilled, (state, { payload }) => {
        state.gameState = payload;
      })
      .addMatcher(
        isAnyOf(
          createCompetition.fulfilled,
          updateCompetition.fulfilled,
          getCompetitionById.fulfilled,
        ),
        (state, { payload }) => {
          const responseCompetition = convertToCompetitionFromResponse(
            payload?.data,
          );
          state.competitions = {
            ...state.competitions,
            [responseCompetition.id]: responseCompetition,
          };
        },
      )
      .addMatcher(
        isAnyOf(getCompetitionByDate.fulfilled, getCompetitions.fulfilled),
        (state, { payload }) => {
          const competitions = payload.data.map((obj: {}) => ({ ...obj }));
          state.competitions = competitions;
          state.size = payload.size;
        },
      )
      .addMatcher(
        isAnyOf(
          getAllInvitationsByCompetitionId.fulfilled,
          inviteToCompetitionByUserId.fulfilled,
          declineInvitationToCompetitionByUserId.fulfilled,
          excludeFromCompetitionByUserId.fulfilled,
        ),
        (state, { payload }) => {
          state.invitations = payload;
        },
      )
      .addMatcher(
        isAnyOf(
          startCompetition.fulfilled,
          finishCompetition.fulfilled,
          cancelCompetition.fulfilled,
        ),
        (state, { payload }) => {
          const competition = payload;
          state.competitions = {
            ...state.competitions,
            [competition.id]: competition,
          };
        },
      );
  },
});

export const { changeCompetitionDate, changeCoordinateLocation } =
  competitionSlice.actions;

export default competitionSlice.reducer;
