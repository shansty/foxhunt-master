import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { omit } from 'lodash';

import {
  closeProviderFailure,
  removeProviderFailure,
  addEventListenerFailure,
  removeEventListenerFailure,
  sseError,
} from 'src/store/actions/sseActions';
import {
  SSE_EVENT_TYPE,
  SSE_CONNECTION_STATE,
} from 'src/store/constants/commonConstants';
import { ENTITY as sse } from 'src/store/actions/types/sseTypes';
import type { SseSliceState } from './types';
import type { SseAction } from './types';

const translateEventSourceState = (state: number) => {
  switch (state) {
    case 0:
      return SSE_CONNECTION_STATE.CONNECTING;
    case 1:
      return SSE_CONNECTION_STATE.OPEN;
    case 2:
      return SSE_CONNECTION_STATE.CLOSED;
    default:
      return SSE_CONNECTION_STATE.UNKNOWN;
  }
};

const initialState: SseSliceState = {};

const getEventType = (action: SseAction) => action.meta.type;
const getSseName = (action: SseAction) => action.meta.identity || 'generic';
const getPayloadMessage = (action: SseAction) => action.payload.message || null;

export const sseSlice = createSlice({
  name: sse,
  initialState,
  reducers: {
    createProviderSuccess: {
      reducer: (state, action: SseAction) => {
        const eventSource = action.payload;
        return {
          ...state,
          [getSseName(action)]: {
            eventSource,
            message: null,
            error: null,
            state: translateEventSourceState(eventSource.readyState),
            events: {},
          },
        };
      },
      prepare: (payload, meta) => ({ payload, meta }),
    },
    updateProviderState: {
      reducer: (state, action: SseAction) => {
        const sseName = getSseName(action);
        return {
          ...state,
          [sseName]: {
            ...state[sseName],
            state: translateEventSourceState(action.payload),
          },
        };
      },
      prepare: (payload, meta) => ({ payload, meta }),
    },
    removeProviderSuccess: {
      reducer: (state, action: SseAction) => {
        return {
          ...omit(state, getSseName(action)),
        };
      },
      prepare: (payload, meta) => ({ payload, meta }),
    },
    addEventListenerSuccess: {
      reducer: (state, action: SseAction) => {
        const { event, listener } = action.payload;
        const sseName = getSseName(action);
        return {
          ...state,
          [sseName]: {
            ...state[sseName],
            events: { ...state[sseName].events, [event]: listener },
          },
        };
      },
      prepare: (payload, meta) => ({ payload, meta }),
    },
    removeEventListenerSuccess: {
      reducer: (state, action: SseAction) => {
        const sseName = getSseName(action);
        return {
          ...state,
          [sseName]: {
            ...state[sseName],
            events: state[sseName].events.delete(action.payload),
          },
        };
      },
      prepare: (payload, meta) => ({ payload, meta }),
    },
    sseMessage: {
      reducer: (state, action: SseAction) => {
        const eventType = getEventType(action);
        const sseName = getSseName(action);
        return eventType === SSE_EVENT_TYPE.generic
          ? {
              ...state,
              [sseName]: {
                ...state[sseName],
                message: action.payload,
              },
            }
          : state;
      },
      prepare: (payload, meta) => ({ payload, meta }),
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        closeProviderFailure,
        removeProviderFailure,
        addEventListenerFailure,
        removeEventListenerFailure,
        sseError,
      ),
      (state, action) => {
        const sseName = getSseName(action);
        const eventType = getEventType(action);
        const payloadMessage = getPayloadMessage(action);
        const error =
          eventType === SSE_EVENT_TYPE.generic
            ? state[sseName].error
            : payloadMessage;
        return {
          ...state,
          [sseName]: {
            ...state[sseName],
            error,
          },
        };
      },
    );
  },
});

export const {
  sseMessage,
  updateProviderState,
  createProviderSuccess,
  removeProviderSuccess,
  addEventListenerSuccess,
  removeEventListenerSuccess,
} = sseSlice.actions;

export default sseSlice.reducer;
