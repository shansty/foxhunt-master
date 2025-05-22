export const ACTION_TYPE_DELIMITER = '_';

export const STATE = {
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  // [ERROR] should not be used for any API calls. Reserved for SSE action types
  ERROR: 'ERROR',
};

export const ACTION = {
  FETCH: 'FETCH',
  FETCH_BY_ID: 'FETCH_BY_ID',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  REMOVE: 'REMOVE',
  // [ADD] should not be used for any API calls. Reserved for SSE action types
  ADD: 'ADD',
  CLOSE: 'CLOSE',
  CHANGE_ORG_STATUS: 'CHANGE_ORG_STATUS',
  FETCH_USERS: 'FETCH_USERS',
  ENQUEUE: 'ENQUEUE',
  ORG_PACKAGE_ENTITY: 'ORG_PACKAGE_ENTITY',
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
