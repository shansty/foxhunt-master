export const STATE = {
  STATE: 'STATE',
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  // [ERROR] should not be used for any API calls. Reserved for SSE action types
  ERROR: 'ERROR',
};

export const ACTION = {
  FETCH: 'FETCH',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  REMOVE: 'REMOVE',
  TOGGLE: 'TOGGLE',
  // [ADD] should not be used for any API calls. Reserved for SSE action types
  ADD: 'ADD',
  CLOSE: 'CLOSE',
  ENQUEUE: 'ENQUEUE',
  CLEAR: 'CLEAR',
  CLONE: 'CLONE',
};

export const ID_COMPETITION = 'newCompetition';

export const SSE_EVENT_TYPE = {
  generic: 'generic',
  event: 'event',
};

export const SSE_CONNECTION_STATE = {
  CONNECTING: 'CONNECTING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  UNKNOWN: 'UNKNOWN',
};

export const INVITATION_STATUS = {
  ACCEPTED: 'ACCEPTED',
  PENDING: 'PENDING',
  DECLINED: 'DECLINED',
  PERMANENTLY_DECLINED: 'PERMANENTLY_DECLINED',
  EXPIRED: 'EXPIRED',
};

export const INVITATION_SOURCE = {
  TRAINER: 'Trainer',
  PARTICIPANT: 'Participant',
};
