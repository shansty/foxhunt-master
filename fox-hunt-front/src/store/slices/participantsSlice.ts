import { createSlice } from '@reduxjs/toolkit';

import { getParticipants } from 'src/store/actions/participantActions';
import type { User } from 'src/types/User';
import { ENTITY as participants } from 'src/store/actions/types/participantsTypes';
import type { ParticipantsSliceState } from './types';

const initialState: ParticipantsSliceState = {
  participants: {},
  coaches: {},
};

export const participantsSlice = createSlice({
  name: participants,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getParticipants.fulfilled, (state, { payload }) => {
      const participants = payload.participants.reduce(
        (acc: {}, obj: User) => ({ ...acc, [obj.id as number | string]: obj }),
        {},
      );
      const coaches = payload.coaches.reduce(
        (acc: {}, obj: User) => ({ ...acc, [obj.id as number | string]: obj }),
        {},
      );
      state.participants = participants;
      state.coaches = coaches;
    });
  },
});

export default participantsSlice.reducer;
