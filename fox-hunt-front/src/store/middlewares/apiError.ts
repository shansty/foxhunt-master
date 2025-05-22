import { AnyAction } from 'redux';
import { get } from 'lodash';
import { createErrorMessage } from 'src/utils/notificationUtil';
import { enqueueSnackbar } from 'src/store/actions/notificationsActions';
import { GENERAL_ERROR, ERROR_MESSAGE } from 'src/constants/apiErrorsConst';
import { createKey, createInitialType } from 'src/utils/middlewareUtils';
import { ErrorState } from 'src/store/typings/errors';
import {
  PENDING,
  FULFILLED,
  REJECTED,
} from 'src/store/constants/toolkitConstants';
import { setError } from 'src/store/slices/errorsSlice';
import { refreshToken, logOut } from 'src/store/actions/authActions';
import { ERROR_CODES } from 'src/constants/errorCodes';
import { NOTIFY_ERROR_DEACTIVATED_ORGANIZATION } from 'src/constants/notifyConst';

// TODO: replace console with the logger, when it's in place

export const apiError =
  ({ dispatch }: any) =>
  (next: any) =>
  (action: AnyAction) => {
    const { type, payload = {} } = action;
    const errors: ErrorState = {};
    const key = createKey(type, 'Error');
    const actionInProgressOrResolved =
      type.endsWith(PENDING) || type.endsWith(FULFILLED);
    const actionRejected = type.endsWith(REJECTED);

    if (actionInProgressOrResolved) {
      errors[key] = null;
      dispatch(setError(errors));
    }
    if (actionRejected) {
      errors[key] = payload.error || payload;
      dispatch(setError(errors));
      const initialType = createInitialType(type);
      const notificationErrorMessage =
        ERROR_MESSAGE[initialType] || GENERAL_ERROR;
      const errorMessage = get(
        payload,
        ['response', 'data', 'message'],
        notificationErrorMessage,
      );
      const responseStatus = payload.response.status;

      if (
        responseStatus === 401 &&
        payload.response.data.message === ERROR_CODES.NOT_VERIFIED_ACCESS_TOKEN
      ) {
        dispatch(refreshToken());
        return;
      }

      if (
        responseStatus === 401 &&
        payload.response.data.message === ERROR_CODES.DEACTIVATED_ORGANIZATION
      ) {
        dispatch(
          enqueueSnackbar(
            createErrorMessage(NOTIFY_ERROR_DEACTIVATED_ORGANIZATION, dispatch),
          ),
        );
        dispatch(logOut());
        return;
      }
      dispatch(
        enqueueSnackbar(createErrorMessage(notificationErrorMessage, dispatch)),
      );

      console.error(`[${type}]`, payload.response);
      return next({
        type,
        payload: errorMessage,
      });
    }
    return next(action);
  };
