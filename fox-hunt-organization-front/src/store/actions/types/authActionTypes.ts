import { ACTION } from '../../constants/commonConstants';
import { createRequestSuccessFailure } from '../../../utils/utils';
import deepFreeze from 'deep-freeze';

const ENTITY = 'TOKEN';

export const AuthActionTypes = deepFreeze({
  create: {
    ...createRequestSuccessFailure(ACTION.FETCH, ENTITY),
  },
  logout: 'LOGOUT',
});
