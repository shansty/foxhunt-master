import { ACTION } from '../../constants/commonConstants';
import { createRequestSuccessFailure } from '../../../utils/utils';
import deepFreeze from 'deep-freeze';

const ENTITY = 'USER';

export const UserActionTypes = deepFreeze({
  create: {
    ...createRequestSuccessFailure(ACTION.CREATE, ENTITY),
  },
  fetchUsers: {
    ...createRequestSuccessFailure(ACTION.FETCH_USERS, ENTITY),
  },
  updateOrganizationAdmin: {
    ...createRequestSuccessFailure(ACTION.UPDATE, ENTITY),
  },
});
