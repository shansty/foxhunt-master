import { ACTION } from '../../constants/commonConstants';
import { createRequestSuccessFailure } from '../../../utils/utils';

import deepFreeze from 'deep-freeze';
const ENTITY = 'ALL_USERS';
const BAN_UNBAN_ENTITY = 'BAN_UNBAN_ENTITY';

export const AllUsersActionTypes = deepFreeze({
  fetch: {
    ...createRequestSuccessFailure(ACTION.FETCH, ENTITY),
  },
  create: {
    ...createRequestSuccessFailure(ACTION.CREATE, ENTITY),
  },
  update: {
    ...createRequestSuccessFailure(ACTION.UPDATE, ENTITY),
  },
});

export const BanUnbanActionTypes = deepFreeze({
  fetch: {
    ...createRequestSuccessFailure(ACTION.FETCH, BAN_UNBAN_ENTITY),
  },
});
