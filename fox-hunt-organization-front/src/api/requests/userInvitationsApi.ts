import { userInvitationsApiInstance } from '../ApiInstances';
import { Invitation } from '../../types/Invitation';

type Id = number;

const userInvitationsApi = {
  getAll: () => userInvitationsApiInstance.get<Invitation[]>(''),
  declineUserInvitation: (id: Id) =>
    userInvitationsApiInstance.patch<Invitation>(`/${id}/decline`),
  resendUserInvitation: (id: Id) =>
    userInvitationsApiInstance.post(`/${id}/resend`),
};

export default userInvitationsApi;
