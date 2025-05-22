import { ACTION } from '../../constants/commonConstants';
import { createRequestSuccessFailure } from '../../../utils/utils';

import deepFreeze from 'deep-freeze';
const ENTITY = 'ORGANIZATION';

export const OrganizationActionTypes = deepFreeze({
  create: {
    ...createRequestSuccessFailure(ACTION.CREATE, ENTITY),
  },
  fetch: {
    ...createRequestSuccessFailure(ACTION.FETCH, ENTITY),
  },
  update: {
    ...createRequestSuccessFailure(ACTION.UPDATE, ENTITY),
  },
  fetchById: {
    ...createRequestSuccessFailure(ACTION.FETCH_BY_ID, ENTITY),
  },
  changeOrgStatus: {
    ...createRequestSuccessFailure(ACTION.CHANGE_ORG_STATUS, ENTITY),
  },
});
