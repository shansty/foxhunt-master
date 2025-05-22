import { ACTION } from '../../constants/commonConstants';
import { createRequestSuccessFailure } from '../../../utils/utils';

import deepFreeze from 'deep-freeze';
const ENTITY = 'ROLE';

export const RoleActionTypes = deepFreeze({
  fetch: {
    ...createRequestSuccessFailure(ACTION.FETCH, ENTITY),
  },
});
