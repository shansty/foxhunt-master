import {
  RootUser,
  GetUsersParams,
  UpdateOrganizationAdminBody,
} from '../../types/RootUser';
import { formatArrayIntoUrlParams } from '../../utils/formatUtil';
import { usersApiInstance } from '../ApiInstances';

type NewUser = Pick<
  RootUser,
  'firstName' | 'lastName' | 'email' | 'dateOfBirth' | 'country' | 'city'
>;

const usersApi = {
  create: (user: NewUser) => usersApiInstance.post('', user),
  getUsers: (params: GetUsersParams) => {
    return usersApiInstance.get<RootUser[]>(`/`, {
      params: params,
      paramsSerializer: formatArrayIntoUrlParams,
    });
  },
  updateOrganizationAdmin: (body: UpdateOrganizationAdminBody) => {
    return usersApiInstance.put(`/organization-admin`, body);
  },
};

export default usersApi;
