export interface FeatureOrganization {
  featureOrganizations: Map<string | number, boolean>;
  name: string;
  id: number | string;
}

export interface UpdateFeatureOrganization {
  featureOrganizationEntities: {
    organizationEntity: string;
    featureEntity: string;
    isEnabled: boolean;
  }[];
}
