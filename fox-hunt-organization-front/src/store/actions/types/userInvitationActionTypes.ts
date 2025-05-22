import { ACTION } from '../../constants/commonConstants';
import { createRequestSuccessFailure } from '../../../utils/utils';

import deepFreeze from 'deep-freeze';
const ENTITY = 'USER_INVITATION';

export const UserInvitationActionTypes = deepFreeze({
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
