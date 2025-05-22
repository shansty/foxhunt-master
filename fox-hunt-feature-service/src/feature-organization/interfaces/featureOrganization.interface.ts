import { FeatureOrganizationEntity } from '../repository/feature-organization.entity';

export type IFeatureOrganizationRelation = Pick<
  FeatureOrganizationEntity,
  'organizationEntity' | 'featureEntity'
> &
  Partial<Pick<FeatureOrganizationEntity, 'isEnabled'>>;

interface FeatureOrganizationResponseData {
  isEnabled: boolean;
  id: number;
}

export interface FeatureOrganizationIsEnabledData {
  isEnabled: boolean;
  featureEntity: {
    name: string;
  };
}

export interface FeatureOrganizationRelationsForCurrentOrgnaization {
  name: string;
}

export interface FeatureOrganizationResponse {
  id: number;
  name: string;
  featureOrganizations: FeatureOrganizationResponseData[];
}

export interface FeatureOrganizationRaw {
  FeatureOrganizationEntity_feature_organization_id: string;
  FeatureOrganizationEntity_is_enabled: false;
  FeatureOrganizationEntity_organization_id: string;
  FeatureOrganizationEntity_feature_id: string;
}

export interface UpdateFeatureOrganizationRelationsResponse {
  affected: number;
}
