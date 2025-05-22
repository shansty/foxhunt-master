import _ from 'lodash';

export const createAction = (type: string, payload?: any, meta?: any) => ({
  type,
  payload: _.defaultTo(payload, undefined),
  meta: _.defaultTo(meta, undefined),
});
