import { OrganizationEntity } from 'src/common/entities/organization.entity';
import { Order } from 'src/common/enums/Order.enum';
import { Sort } from 'src/common/enums/Sort.enum';

export interface OrgTrainersParams {
  page: number;
  size: number;
  roles: UserRoles;
}

export type UserRoles =
  | 'PARTICIPANT'
  | 'TRAINER'
  | 'SYSTEM_ADMIN'
  | 'ORGANIZATION_ADMIN';

export type ExistingOrganizationResponse = {
  id: number;
};

export type ISortData = [Sort, Order];

export type OrganizationResponse = OrganizationEntity & {
  rootUserEmail: string;
};
