import { Dispatch } from 'redux';
import { createAction } from './actionCreator';

export default function composeSimpleApiCallingAction(
  requestActionType: string,
  successActionType: string,
  errorActionType: string,
  workingFunction: Function,
  onSuccessHandler?: Function,
  onErrorHandler?: Function,
) {
  return (...args: any[]) =>
    async (dispatch: Dispatch) => {
      dispatch(createAction(requestActionType));
      try {
        const response = await workingFunction(...args);
        dispatch(createAction(successActionType, response.data, args));
        if (onSuccessHandler) {
          onSuccessHandler(dispatch);
        }
        return response;
      } catch (error) {
        if (onErrorHandler) {
          onErrorHandler(dispatch);
        }
        dispatch(createAction(errorActionType, error));
        return error;
      }
    };
}
