import { ACTION } from '../../constants/commonConstants';
import { createRequestSuccessFailure } from '../../../utils/utils';

import deepFreeze from 'deep-freeze';
const ENTITY = 'PACKAGE';

export const PackageActionTypes = deepFreeze({
  fetchOrganizationPackages: {
    ...createRequestSuccessFailure(ACTION.ORG_PACKAGE_ENTITY, ENTITY),
  },
  fetchPackages: {
    ...createRequestSuccessFailure(ACTION.FETCH, ENTITY),
  },
  update: {
    ...createRequestSuccessFailure(ACTION.UPDATE, ENTITY),
  },
});
