import { ACTION } from '../../constants/commonConstants';
import { createRequestSuccessFailure } from '../../../utils/utils';
import deepFreeze from 'deep-freeze';

const ENTITY = 'FEATURE';

export const FeatureActionTypes = deepFreeze({
  fetch: {
    ...createRequestSuccessFailure(ACTION.FETCH, ENTITY),
  },
  update: {
    ...createRequestSuccessFailure(ACTION.UPDATE, ENTITY),
  },
});
