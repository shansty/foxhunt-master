import { isNil } from 'lodash';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { createAction } from '@reduxjs/toolkit';

import { SSE_EVENT_TYPE } from 'src/store/constants/commonConstants';
import {
  selectEventListenerByName,
  selectSseEventSource,
} from 'src/store/selectors/sseSelectors';
import * as sseTypes from './types/sseTypes';
import { activeCompetitionsAPI } from 'src/api/admin';
import * as sseActions from 'src/store/slices/sseSlice';
import type { AppDispatch, RootState } from 'src/store';
import * as tokenUtils from 'src/api/utils/tokenUtils';

export const closeProviderFailure = createAction(
  sseTypes.CLOSE_PROVIDER_FAILURE,
  (payload, meta) => ({
    payload,
    meta,
  }),
);

export const removeProviderFailure = createAction(
  sseTypes.REMOVE_PROVIDER_FAILURE,
  (payload, meta) => ({
    payload,
    meta,
  }),
);

export const addEventListenerFailure = createAction(
  sseTypes.ADD_EVENT_LISTENER_FAILURE,
  (payload, meta) => ({ payload, meta }),
);

export const removeEventListenerFailure = createAction(
  sseTypes.REMOVE_EVENT_LISTENER_FAILURE,
  (payload, meta) => ({ payload, meta }),
);

export const sseError = createAction(sseTypes.SSE_ERROR, (payload, meta) => ({
  payload,
  meta,
}));

const createSSEActionMeta = (identity: string, type?: string) =>
  isNil(type) ? { identity } : { identity, type };

// TODO set withCredentials to true, when CORS issue is resolved
export const createSseProvider =
  ({ apiUrl, identity }: { apiUrl: string; identity: string }) =>
  (dispatch: AppDispatch) => {
    const accessToken = tokenUtils.getAccessToken();
    const eventSource = new EventSourcePolyfill(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'text/event-stream',
      },
    });
    dispatch(
      sseActions.createProviderSuccess(
        eventSource,
        createSSEActionMeta(identity),
      ),
    );
    listenBaseEvents({ eventSource, identity, dispatch });
  };

export const closeSseProvider =
  ({ identity }: { identity: string }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const eventSource = selectSseEventSource(getState(), identity);
    if (!(eventSource instanceof EventSourcePolyfill)) {
      return dispatch(
        closeProviderFailure(
          new Error('There is no such provider.'),
          createSSEActionMeta(identity, SSE_EVENT_TYPE.event),
        ),
      );
    }
    eventSource.close();
    await activeCompetitionsAPI.delete('/subscription');
    dispatch(
      sseActions.updateProviderState(
        eventSource.readyState,
        createSSEActionMeta(identity, SSE_EVENT_TYPE.event),
      ),
    );
  };

export const removeSseProvider =
  ({ identity }: { identity: string }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const eventSource = selectSseEventSource(getState(), identity);
    if (!(eventSource instanceof EventSourcePolyfill)) {
      return dispatch(
        removeProviderFailure(
          new Error('There is no such provider.'),
          createSSEActionMeta(identity, SSE_EVENT_TYPE.event),
        ),
      );
    }
    eventSource.close();
    await activeCompetitionsAPI.delete('/subscription');
    dispatch(
      sseActions.removeProviderSuccess(
        null,
        createSSEActionMeta(identity, SSE_EVENT_TYPE.event),
      ),
    );
  };

export const addEventListener =
  (params: {
    event: string;
    listener: (event: any) => void;
    eventSource: any;
    identity: string;
  }) =>
  (dispatch: AppDispatch) => {
    const { event, listener, eventSource, identity } = params;
    if (!(eventSource instanceof EventSourcePolyfill)) {
      return dispatch(
        addEventListenerFailure(
          new Error('Invalid EventSource provided'),
          createSSEActionMeta(identity, SSE_EVENT_TYPE.event),
        ),
      );
    }
    eventSource.addEventListener(event, listener);
    dispatch(
      sseActions.addEventListenerSuccess(
        { event, listener },
        createSSEActionMeta(identity),
      ),
    );
  };

export const removeEventListener =
  (params: { event: string; eventSource: any; identity: string }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { event, eventSource, identity } = params;
    if (!(eventSource instanceof EventSourcePolyfill)) {
      return dispatch(
        removeEventListenerFailure(
          new Error('Invalid EventSource provided'),
          createSSEActionMeta(identity, SSE_EVENT_TYPE.event),
        ),
      );
    }
    const eventListener = selectEventListenerByName(
      getState(),
      identity,
      event,
    );
    if (typeof eventListener !== 'function') {
      return dispatch(
        removeEventListenerFailure(
          new Error('You are not subscribed to this event'),
          createSSEActionMeta(identity, SSE_EVENT_TYPE.event),
        ),
      );
    }
    eventSource.removeEventListener(event, eventListener);
    dispatch(
      sseActions.removeEventListenerSuccess(
        event,
        createSSEActionMeta(identity),
      ),
    );
  };

const listenBaseEvents = (params: {
  eventSource: EventSourcePolyfill;
  identity: string;
  dispatch: AppDispatch;
}) => {
  const { eventSource, identity, dispatch } = params;
  eventSource.onopen = () => {
    dispatch(
      sseActions.updateProviderState(
        eventSource.readyState,
        createSSEActionMeta(identity),
      ),
    );
  };
  eventSource.onmessage = (event: any) => {
    try {
      const message = JSON.parse(event.data);
      dispatch(
        sseActions.sseMessage(
          message,
          createSSEActionMeta(identity, SSE_EVENT_TYPE.generic),
        ),
      );
    } catch (error) {
      console.error(`[SSE ${identity}]`, error.message);
      dispatch(
        sseError(error, createSSEActionMeta(identity, SSE_EVENT_TYPE.event)),
      );
    }
  };
  eventSource.onerror = (event: any) => {
    console.error(`[SSE ${identity}]`, eventSource.readyState, event);
    dispatch(
      sseError(null, createSSEActionMeta(identity, SSE_EVENT_TYPE.generic)),
    );
    dispatch(
      sseActions.updateProviderState(
        eventSource.readyState,
        createSSEActionMeta(identity, SSE_EVENT_TYPE.generic),
      ),
    );
  };
  eventSource.addEventListener('ERROR', (event: any) => {
    console.error(`[SSE ${identity}]`, eventSource.readyState, event);
    dispatch(
      sseError(
        new Error(event.data),
        createSSEActionMeta(identity, SSE_EVENT_TYPE.event),
      ),
    );
    dispatch(
      sseActions.updateProviderState(
        eventSource.readyState,
        createSSEActionMeta(identity, SSE_EVENT_TYPE.event),
      ),
    );
    // TODO: Should we send from the server an error code and the message to avoid such things?
    if (event.data === "You can't subscribe to this competition") {
      dispatch(closeSseProvider({ identity }));
    }
  });
};
