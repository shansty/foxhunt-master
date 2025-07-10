import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from 'lodash';

import {
  activeCompetitionsAPI,
  competitionsAPI,
  competitionTemplatesAPI,
} from 'src/api/admin';
import {
  INVITATION_SOURCE,
  INVITATION_STATUS,
} from 'src/store/constants/commonConstants';
import history from 'src/history';
import { closeSseProvider } from './sseActions';
import { STATUS_RUNNING } from 'src/constants/competitionStatusConst';
import {
  buildCompetitionUrl,
  buildWatchOneCompetitionByIdUrl,
} from 'src/api/utils/navigationUtil';
import {
  convertCoordinatesToFoxPoints,
  convertToCompetitionArrayFromResponse,
  convertToCompetitionForRequest,
  convertToCompetitionFromResponse,
} from 'src/api/utils/geometryConverter';
import { enqueueSnackbar } from './notificationsActions';
import { createErrorMessage } from 'src/utils/notificationUtil';
import { ERRORS } from 'src/constants/commonConst';
import * as competitionsTypes from './types/competitionsTypes';
import type { User, Invitation } from 'src/types/User';
import type { Location } from 'src/types/Location';
import type { FoxPoint, Competition } from 'src/types/Competition';
import { AppDispatch, RootState } from 'src/store';

interface GetCompetitionsParams {
  launch: boolean;
  page: number;
  size: number;
  name: string;
  sort: string;
  statuses: string | string[];
  upcoming: boolean;
}

export const getCompetitions = createAsyncThunk(
  competitionsTypes.GET_COMPETITIONS,
  async (params: Partial<GetCompetitionsParams> = {}, { rejectWithValue }) => {
    try {
      if (params.statuses) params.statuses = params.statuses.toString();
      const response = await competitionsAPI.get('/', {
        params,
      });
      const competitions = convertToCompetitionArrayFromResponse(
        response.data.content,
      );
      return {
        data: competitions,
        size: response.data.totalElements,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getCurrentCompetitions = createAsyncThunk(
  competitionsTypes.GET_CURRENT_COMPETITIONS,
  async (payload, { rejectWithValue }) => {
    try {
      const params = { statuses: STATUS_RUNNING };
      const response = await competitionsAPI.get('/', {
        params,
      });
      const competitions = convertToCompetitionArrayFromResponse(
        response.data.content,
      );
      return competitions;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getCompetitionByDate = createAsyncThunk(
  competitionsTypes.GET_COMPETITION_BY_DATE,
  async (
    params: { date: string; status: string | string[] },
    { rejectWithValue },
  ) => {
    try {
      const { date, status } = params;
      const [year, month, day = ''] = date.split('-');
      const dayRequest = day && `&startDate.day=${day}`;
      const dateRequest = `startDate.year=${year}&startDate.month=${month}${dayRequest}`;
      const response = await competitionsAPI.get(
        `?${dateRequest}&statuses=${status}`,
      );
      const competitions = convertToCompetitionArrayFromResponse(
        response.data.content,
      );
      return {
        data: competitions,
        size: response.data.totalElements,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getCompetitionById = createAsyncThunk(
  competitionsTypes.GET_COMPETITION_BY_ID,
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await competitionsAPI.get(`/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getAllInvitationsByCompetitionId = createAsyncThunk(
  competitionsTypes.GET_INVITATIONS_BY_COMPETITION_ID,
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await competitionsAPI.get(`/${id}/invitations`);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const inviteToCompetitionByUserId = createAsyncThunk(
  competitionsTypes.INVITE_TO_COMPETITION_BY_USER_ID,
  async (
    data: {
      invitations: Invitation[];
      competitionId: number;
      participantId: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { invitations, competitionId, participantId } = data;
      const response = await competitionsAPI.post(
        `/${competitionId}/subscription`,
        {},
        { params: { participantId } },
      );

      const modifiedInvitations = invitations.filter(
        (invitation: Invitation) => invitation.participant.id !== participantId,
      );
      modifiedInvitations.push(response.data);
      return modifiedInvitations;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const excludeFromCompetitionByUserId = createAsyncThunk(
  competitionsTypes.EXCLUDE_FROM_COMPETITION_BY_USER_ID,
  async (
    data: {
      invitations: Invitation[];
      competitionId: number;
      participantId: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { invitations, competitionId, participantId } = data;
      await competitionsAPI.delete(`/${competitionId}/participants`, {
        params: { participantId },
      });
      const modifiedInvitations = invitations.filter(
        (invitation: Invitation) => invitation.participant.id !== participantId,
      );
      return modifiedInvitations;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const declineInvitationToCompetitionByUserId = createAsyncThunk(
  competitionsTypes.DECLINE_INVITATION_TO_COMPETITION_BY_USER_ID,
  async (
    data: {
      invitations: Invitation[];
      competitionId: number;
      participantId: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { invitations, competitionId, participantId } = data;
      const response = await competitionsAPI.put(
        `/${competitionId}/invitation/decline`,
        {},
        { params: { participantId } },
      );
      const modifiedInvitations = invitations.filter(
        (invitation: Invitation) => invitation.participant.id !== participantId,
      );
      modifiedInvitations.push(response.data);
      return modifiedInvitations;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const declineInvitationPermanently = createAsyncThunk(
  competitionsTypes.DECLINE_INVITATION_PERMANENTLY,
  async (
    data: {
      invitations: Invitation[];
      competitionId: number;
      participantId: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { invitations, competitionId, participantId } = data;

      const response = await competitionsAPI.put(
        `/${competitionId}/invitation/permanent-decline`,
        {},
        { params: { participantId } },
      );

      const foundUserInvitation = invitations.find(
        (invitation) => invitation.participant.id === participantId,
      );
      if (!foundUserInvitation) {
        return [...invitations, response.data];
      }

      const updatedInvitations = invitations.map((invitation) => {
        if (invitation.participant.id === participantId) {
          return response.data;
        }
        return invitation;
      });

      return updatedInvitations;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const acceptInvitationToCompetitionByUserId = createAsyncThunk(
  competitionsTypes.ACCEPT_INVITATION_TO_COMPETITION_BY_USER_ID,
  async (
    payload: {
      invitations: Invitation[];
      competitionId: number;
      participantId: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { invitations, competitionId, participantId } = payload;
      await competitionsAPI.put(
        `/${competitionId}/invitation/accept`,
        {},
        { params: { participantId } },
      );
      const modifiedInvitations = invitations.map((invitation) => {
        if (invitation.participant.id === participantId) {
          invitation.status = INVITATION_STATUS.ACCEPTED;
          return invitation;
        }
        return invitation;
      });
      return modifiedInvitations;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const removeCompetition = createAsyncThunk(
  competitionsTypes.REMOVE_COMPETITION,
  async (id, { rejectWithValue }) => {
    try {
      await competitionsAPI.delete(`/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createCompetition = createAsyncThunk(
  competitionsTypes.CREATE_COMPETITION,
  async (competition, { dispatch, rejectWithValue }) => {
    try {
      const requestCompetition = convertToCompetitionForRequest(competition);
      console.dir({requestCompetition})
      console.log("Sending competition payload:", JSON.stringify(requestCompetition, null, 2));
      const response = await competitionsAPI.post('/', requestCompetition);
      console.dir({response})
      return response;
    } catch (error) {
      // Address 409 status error han
      // dling
      if (error.response.status === 409) {
        const {
          response: {
            data: { message },
          },
        } = error;
         console.dir({in_catch: error.response})
        dispatch(enqueueSnackbar(createErrorMessage(message, dispatch)));
      } else {
        return rejectWithValue(error);
      }
    }
  },
);

export const updateCompetition = createAsyncThunk(
  competitionsTypes.UPDATE_COMPETITION,
  async (
    competition: { location: Location; id: number },
    { rejectWithValue },
  ) => {
    try {
      let requestCompetition;
      if (competition.location) {
        requestCompetition = convertToCompetitionForRequest(competition);
      } else {
        requestCompetition = competition;
      }
      const response = await competitionsAPI.patch(
        `/${competition.id}`,
        requestCompetition,
      );
      console.dir({ url: competition.id });
      console.dir({ requestCompetition });
      console.dir({ response });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const startCompetition = createAsyncThunk(
  competitionsTypes.START_COMPETITION,
  async (
    {
      id,
      ...payload
    }: { id: number; foxPoints: FoxPoint[]; participants: Partial<User> },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const requestData = {
        ...payload,
        foxPoints: convertCoordinatesToFoxPoints(payload.foxPoints),
      };
      const response = await activeCompetitionsAPI.patch(`/${id}/start`, {
        ...requestData,
      });
      const competition = convertToCompetitionFromResponse(response.data);
      dispatch(getCurrentCompetitions());
      history.push(buildWatchOneCompetitionByIdUrl(id));
      return competition;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const finishCompetition = createAsyncThunk<
  Competition,
  { id: number; reasonToStop: string; ssePath: string },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  competitionsTypes.FINISH_COMPETITION,
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { id, reasonToStop, ssePath } = params;
      const response = await activeCompetitionsAPI.patch(`/${id}/finish`, {
        reasonToStop,
      });
      const competition = convertToCompetitionFromResponse(response.data);
      dispatch(getCurrentCompetitions());
      history.push(buildCompetitionUrl());
      dispatch(closeSseProvider({ identity: ssePath }));
      return competition;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const cancelCompetition = createAsyncThunk(
  competitionsTypes.CANCEL_COMPETITION,
  async (params: { id: number; reason: string }, { rejectWithValue }) => {
    try {
      const { id, reason } = params;
      const response = await competitionsAPI.patch(`/${id}/cancellation`, {
        reason,
      });
      const competition = convertToCompetitionFromResponse(response.data);
      return competition;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getGameState = createAsyncThunk(
  competitionsTypes.GET_GAME_SATE,
  async (
    payload: { id: number; params?: { replay: boolean } },
    { rejectWithValue },
  ) => {
    try {
      const { id, params = {} } = payload;
      const { data } = await activeCompetitionsAPI.get(`/${id}`, { params });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createCompetitionFromTemplate = createAsyncThunk(
  competitionsTypes.CREATE_COMPETITION_FROM_TEMPLATE,
  async (
    params: { name: string; id: number },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { name, id } = params;
      const response = await competitionTemplatesAPI.post(
        `?name=${name}&templateId=${id}`,
      );
      const createdCompetition = convertToCompetitionFromResponse(
        response.data,
      );
      return createdCompetition;
    } catch (error) {
      const message = get(
        error,
        ['response', 'data', 'message'],
        ERRORS.GENERAL_ERROR,
      );
      dispatch(enqueueSnackbar(createErrorMessage(message, dispatch)));
      return rejectWithValue(error);
    }
  },
);
