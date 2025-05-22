import { get } from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from 'src/store';

const sseStateSelector = (state: RootState) => state.sseReducer;

const selectSseName = (state: RootState, sseName: string) => sseName;

const selectEvent = (state: RootState, sseName: string, event: any) => event;

export const selectSseEventSource = createSelector(
  [selectSseName, sseStateSelector],
  (sseName, state) => get(state, [sseName, 'eventSource']),
);

export const selectEventListenerByName = createSelector(
  [sseStateSelector, selectSseName, selectEvent],
  (state, sseName, event) =>
    get(state, [sseName, 'events'], new Map()).get(event),
);

export const selectSseState = createSelector(
  [selectSseName, sseStateSelector],
  (sseName, state) => get(state, [sseName, 'state']),
);

export const selectSseGeneralError = createSelector(
  [selectSseName, sseStateSelector],
  (sseName, state) => get(state, [sseName, 'error']),
);
