import { AnyAction } from 'redux';
import { LoadersState } from 'src/store/typings/loaders';
import { createKey } from 'src/utils/middlewareUtils';
import {
  PENDING,
  FULFILLED,
  REJECTED,
} from 'src/store/constants/toolkitConstants';
import { setLoading } from 'src/store/slices/loadersSlice';

type Next = (action: AnyAction) => void | Promise<void>;

export const loadersMiddleware =
  (state: any) => (next: any) => (action: AnyAction) => {
    const { type } = action;
    const loaders: LoadersState = {};
    const actionInProgress = type.endsWith(PENDING);
    const actionFinished = type.endsWith(FULFILLED) || type.endsWith(REJECTED);
    if (actionInProgress) {
      loaders[createKey(type, 'Loading')] = true;
      state.dispatch(setLoading(loaders));
    }
    if (actionFinished) {
      loaders[createKey(type, 'Loading')] = false;
      state.dispatch(setLoading(loaders));
    }
    return next(action);
  };
