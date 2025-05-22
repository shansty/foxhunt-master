import { get } from 'lodash';
import { STATE } from '../constants/commonConstants';
import { NOT_VERIFIED_ACCESS_TOKEN } from '../../constants/errorCodesConstants';
import { UserActionTypes } from '../actions/types/userActionTypes';
import { Dispatch } from 'redux';
import { Action } from '../../types/Actions';
import { refreshToken } from '../actions/authActions';

const GENERAL_ERROR = 'Oops, something went wrong. Please try again later. ';

const DEFAULT_ERROR_MESSAGE: { [type: string]: string } = {
  [UserActionTypes.create.failure]: 'Failed to create a user.',
};

export const apiError =
  ({ dispatch }: any) =>
  (next: Dispatch) =>
  (action: Action<any>) => {
    const { type, payload = {} } = action;

    if (payload?.response?.data?.message === NOT_VERIFIED_ACCESS_TOKEN) {
      dispatch(refreshToken());
      return;
    }

    if (
      typeof type === 'string' &&
      type.includes(STATE.FAILURE) &&
      payload.isAxiosError
    ) {
      const defaultMessage: string =
        DEFAULT_ERROR_MESSAGE[type] || GENERAL_ERROR;
      const errorMessage = get(
        payload,
        ['response', 'data', 'message'],
        defaultMessage,
      );

      return next({
        type,
        payload: errorMessage,
      });
    }

    return next(action);
  };
