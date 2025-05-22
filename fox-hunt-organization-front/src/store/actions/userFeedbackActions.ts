import { createAction } from './common/actionCreator';
import { UserFeedbackActionTypes } from './types/userFeedbackActionTypes';
import { organizationsApi, userFeedbackApi } from '../../api';
import { Dispatch } from 'redux';
import { UserFeedback } from '../../types/UserFeedback';
import { UserFeedbackAction } from '../../types/Actions';

export const fetchFeedbacksByOrganizationId =
  (organizationId: number, params = {}) =>
  async (dispatch: Dispatch<UserFeedbackAction>) => {
    dispatch(createAction(UserFeedbackActionTypes.fetch.request));
    try {
      const response = await organizationsApi.getUserFeedbacksByOrganizationId(
        organizationId,
        params,
      );
      dispatch(
        createAction(UserFeedbackActionTypes.fetch.success, {
          userFeedbacks: response.data.content,
          organizationId,
          size: response.data.totalElements,
        }),
      );
    } catch (error) {
      dispatch(createAction(UserFeedbackActionTypes.fetch.failure, error));
    }
  };

export const patchFeedback =
  (feedback: UserFeedback) =>
  async (dispatch: Dispatch<UserFeedbackAction>) => {
    dispatch(createAction(UserFeedbackActionTypes.update.request));
    try {
      await userFeedbackApi.patchUserFeedback(feedback);
      dispatch(createAction(UserFeedbackActionTypes.update.success));
    } catch (error) {
      dispatch(createAction(UserFeedbackActionTypes.update.failure, error));
    }
  };
