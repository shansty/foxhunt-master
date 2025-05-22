import { RootUser } from './RootUser';
import { ISODate } from './ISODate';
import { organizationStatusEnum, organizationTypeEnum } from '../utils/enums';

export type OrganizationStatus =
  | organizationStatusEnum.NEW
  | organizationStatusEnum.DECLINED
  | organizationStatusEnum.ACTIVE
  | organizationStatusEnum.ONBOARDING
  | organizationStatusEnum.DEACTIVATED;
type OrganizationType =
  | String
  | organizationTypeEnum.FREE
  | organizationTypeEnum.PAID;

export interface Organization {
  id: number;
  name: string;
  legalAddress: string;
  actualAddress: string;
  organizationDomain: string;
  rootUserEmail: string;
  approximateEmployeesAmount: number | string;
  type: OrganizationType;
  status: OrganizationStatus;
  lastStatusChange: string;
  created: ISODate;
  system: boolean;
}

export interface OrganizationFormType {
  name: string | null;
  legalAddress: string | null;
  actualAddress: string | null;
  organizationDomain: string | null;
  rootUserEmail: string | null;
  approximateEmployeesAmount: number | string | null;
  type: OrganizationType | null;
}

export type UpdateOrganizationType = Omit<
  OrganizationFormType,
  'organizationDomain' | 'rootUserEmail'
>;
