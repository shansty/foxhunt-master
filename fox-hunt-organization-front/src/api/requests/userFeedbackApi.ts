import { UserFeedback } from '../../types/UserFeedback';
import { userFeedbackApiInstance } from '../ApiInstances';

const userFeedbackApi = {
  patchUserFeedback: (feedback: UserFeedback) =>
    userFeedbackApiInstance.patch<UserFeedback>('', feedback),
};

export default userFeedbackApi;
