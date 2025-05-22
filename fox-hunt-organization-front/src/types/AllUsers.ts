import { Role } from './RootUser';
import { ISODate } from './ISODate';

export interface User {
  activated: boolean;
  activatedSince: ISODate;
  avatar: string;
  banned: boolean;
  city: string;
  completed: boolean;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
  id: number;
  manageMultipleOrganizations: boolean;
  roles: Role[];
}
