import { createAsyncThunk } from '@reduxjs/toolkit';

import { replayCompetitionsAPI } from 'src/api/admin';
import * as replayTypes from './types/replayTypes';

export const loadTrackers = createAsyncThunk(
  replayTypes.LOAD_TRACKERS,
  async (
    params: {
      id: number;
      participantId: number;
      startPosition: number;
      trackerQuantity: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const {
        id,
        participantId = 0,
        startPosition = 0,
        trackerQuantity = 0,
      } = params;
      const { data } = await replayCompetitionsAPI.get(`/${id}`, {
        params: { participantId, trackerQuantity, startPosition },
      });
      return {
        trackers: data,
        size: null,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const loadInitialTrackers = createAsyncThunk(
  replayTypes.LOAD_INITIAL_TRACKERS,
  async (
    params: {
      id: number;
      participantId: number;
      trackerQuantity: number;
      tracerSize: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const {
        id,
        participantId = 0,
        trackerQuantity = 0,
        tracerSize = 0,
      } = params;
      const size = (
        await replayCompetitionsAPI.get(`/${id}/size`, {
          params: { participantId },
        })
      ).data;

      const loadedTrackerSize =
        trackerQuantity !== 0
          ? trackerQuantity + tracerSize
          : size + tracerSize;

      const { data } = await replayCompetitionsAPI.get(`/${id}`, {
        params: {
          participantId,
          trackerQuantity: loadedTrackerSize,
          startPosition: size + tracerSize,
        },
      });
      return {
        trackers: data,
        size: size,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
