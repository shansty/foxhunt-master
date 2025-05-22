import { RolesEnum } from 'src/utils/types/roleTypes';

export interface User {
  activated: boolean;
  activatedSince?: string;
  city?: string;
  completed?: boolean;
  country?: string;
  dateOfBirth?: string;
  email: string;
  firstName: string;
  id: number | string;
  lastName: string;
  roles?: Role[];
  avatar?: string;
  manageMultipleOrganizations?: boolean;
}

export interface Role {
  organizationId: number;
  userId: number;
  role:
    | RolesEnum.PARTICIPANT
    | RolesEnum.COACH
    | RolesEnum.ADMIN
    | RolesEnum.SYSTEM_ADMIN;
}
export interface Invitation {
  id: number;
  updatedAt?: string;
  participant: Partial<User>;
  status?: string;
  source?: string;
}
