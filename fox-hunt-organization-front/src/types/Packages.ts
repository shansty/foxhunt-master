export interface OrganizationPackage {
  packages: Map<string | number, boolean>;
  name: string;
  id: number | string;
}

export interface Package {
  locationPackageId: number;
  name: string;
  isEditMode?: boolean;
}
export interface OrganizationPackageEntities {
  locationPackageId: string;
  organizationId: string;
}

export interface UpdateOrganizationPackage {
  assignments: OrganizationPackageEntities[];
  unassignments: OrganizationPackageEntities[];
}
