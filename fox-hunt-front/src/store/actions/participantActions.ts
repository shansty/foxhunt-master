import { createAsyncThunk } from '@reduxjs/toolkit';

import { usersAPI } from 'src/api/admin';
import * as roles from 'src/constants/roles';
import * as participantsTypes from './types/participantsTypes';

export const getParticipants = createAsyncThunk(
  participantsTypes.GET_PARTICIPANTS,
  async (params, { rejectWithValue }) => {
    try {
      const { data: participants } = await usersAPI.get(
        `?roles=${roles.PARTICIPANT}&active=true`,
      );
      const { data: coaches } = await usersAPI.get(
        `?roles=${roles.COACH}&active=true`,
      );
      return {
        participants: participants,
        coaches: coaches,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
