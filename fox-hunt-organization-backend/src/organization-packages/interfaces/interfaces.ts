export interface OrganizationPackagesInfo {
  id: number;
  name: string;
  packages: { id: number }[];
}

export interface OrganizationPackagesRaw {
  locationPackageId: number;
  organizationId: number;
  accessType: string;
}
