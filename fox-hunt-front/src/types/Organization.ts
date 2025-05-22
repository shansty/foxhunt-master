import { Location } from './Location';

export interface Organization {
  system: boolean;
  favoriteLocations: Location[];
}

export interface CurrentOrganization {
  id: number;
  name: string;
  legalAddress: string;
  actualAddress: string;
  organizationDomain: string;
  rootUserEmail: string;
  approximateEmployeesAmount: number | string;
  type: string;
  status: string;
  lastStatusChange: string;
  created: string;
  system: boolean;
}
