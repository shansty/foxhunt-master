import { allUsersApiInstance, banUnbanApiInstance } from '../ApiInstances';
import { User } from '../../types/AllUsers';

const allUsersApi = {
  getAll: () => allUsersApiInstance.get<User[]>(''),
  banUnban: (id: number) => banUnbanApiInstance.patch(`/${id}`),
};

export default allUsersApi;
