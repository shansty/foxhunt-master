import { ISODate } from './ISODate';

export interface RootUser {
  activated: boolean;
  city: string;
  country: string;
  dateOfBirth: ISODate;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  roles: [
    {
      id: number;
      role: Roles;
    },
  ];
}

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  city: string;
  email: string;
  isActivated?: string;
}

export type Roles =
  | 'PARTICIPANT'
  | 'TRAINER'
  | 'SYSTEM_ADMIN'
  | 'ORGANIZATION_ADMIN';

export interface GetUsersParams {
  page?: number;
  size?: number;
  roles: Roles[];
  organizationId: number;
  active?: boolean;
}
export interface UpdateOrganizationAdminBody {
  organizationId: number;
  userId: number;
}

export interface Role {
  organizationId: number;
  userId: number;
  role: Roles;
}
