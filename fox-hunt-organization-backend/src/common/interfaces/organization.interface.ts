import { OrganizationEntity } from '../entities/organization.entity';

interface UserInfo {
  rootUserEmail: string;
}

export type IOrganization = Pick<
  OrganizationEntity,
  'legalAddress' | 'name' | 'organizationDomain' | 'type'
> &
  Pick<UserInfo, 'rootUserEmail'> &
  Partial<
    Pick<OrganizationEntity, 'actualAddress' | 'approximateEmployeesAmount'>
  >;

export type IUpdateOrganization = Partial<
  Omit<IOrganization, 'rootUserEmail' | 'organizationDomain'>
>;
