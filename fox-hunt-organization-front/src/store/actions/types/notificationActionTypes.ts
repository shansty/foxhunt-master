import { ACTION } from '../../constants/commonConstants';

const ENTITY = 'SNACKBAR';

export const ENQUEUE_SNACKBAR = `${ACTION.ENQUEUE}_${ENTITY}`;

export const CLOSE_SNACKBAR = `${ACTION.CLOSE}_${ENTITY}`;

export const REMOVE_SNACKBAR = `${ACTION.REMOVE}_${ENTITY}`;
