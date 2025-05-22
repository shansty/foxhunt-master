import { Injectable, Logger } from '@nestjs/common';
import {
  FeatureOrganizationIsEnabledData,
  FeatureOrganizationRaw,
  FeatureOrganizationRelationsForCurrentOrgnaization,
  FeatureOrganizationResponse,
  IFeatureOrganizationRelation,
  UpdateFeatureOrganizationRelationsResponse,
} from 'src/feature-organization/interfaces/featureOrganization.interface';
import { FeatureOrganizationRepository } from 'src/feature-organization/repository/featureOrganization.repository';
import { OrganizationServiceRequests } from 'src/common/requests/organization-service.requests';
import { FeatureService } from 'src/feature/feature.service';
import { OrganizationRequestData } from 'src/common/requests/interfaces/organization.interface';

@Injectable()
export class FeatureOrganizationService {
  private readonly logger = new Logger(FeatureOrganizationService.name);
  constructor(
    private featureOrganizationRepository: FeatureOrganizationRepository,
    private featureService: FeatureService,
    private organizationServiceRequests: OrganizationServiceRequests,
  ) {}

  private combineGloballFeaturesWithCurrentRelations(
    globallyEnabledFeatures: string[],
    featureRelationsForCurrentOrganization: FeatureOrganizationIsEnabledData[],
  ): string[] {
    featureRelationsForCurrentOrganization.forEach((featureOrganization) => {
      const featurePlace: number = globallyEnabledFeatures.indexOf(
        featureOrganization.featureEntity.name,
      );
      const isFeatureAlreadyInEnabledArray: boolean =
        featurePlace === -1 ? false : true;

      if (featureOrganization.isEnabled && !isFeatureAlreadyInEnabledArray)
        globallyEnabledFeatures.push(featureOrganization.featureEntity.name);

      if (!featureOrganization.isEnabled && isFeatureAlreadyInEnabledArray)
        globallyEnabledFeatures.splice(featurePlace, 1);
    });
    return globallyEnabledFeatures;
  }

  public async getByOrganizationId(
    organizationId: number,
  ): Promise<FeatureOrganizationRelationsForCurrentOrgnaization[]> {
    this.logger.log(
      `Request to receive data about enabled/disabled features for organization with id: ${organizationId}`,
    );
    const globallyEnabledFeatures: string[] =
      await this.featureService.getGloballyEnabledFeatures();

    const featureRelationsForCurrentOrganization: FeatureOrganizationIsEnabledData[] =
      await this.featureOrganizationRepository.findByOrganizationId(
        organizationId,
      );

    this.logger.verbose(
      `Provided organization has ${featureRelationsForCurrentOrganization.length} enabled features`,
    );

    return this.combineGloballFeaturesWithCurrentRelations(
      globallyEnabledFeatures,
      featureRelationsForCurrentOrganization,
    ).map((name) => ({
      name,
    }));
  }

  private async getOrganizations(
    organizationFilter?: any,
  ): Promise<FeatureOrganizationResponse[]> {
    const organizationData: OrganizationRequestData[] =
      await this.organizationServiceRequests.getOrganizations(
        organizationFilter,
      );

    return organizationData.map((organization) => ({
      id: organization.id,
      name: organization.name,
      featureOrganizations: [],
    }));
  }

  async getAll(
    organizationFilter?: any,
  ): Promise<FeatureOrganizationResponse[]> {
    this.logger.log(
      'Request to receive data about enabled/disabled features for all organizations',
    );
    const organizationsWithRelatedFeatures: FeatureOrganizationResponse[] =
      await this.getOrganizations(organizationFilter);
    const organizationMap = new Map();
    organizationsWithRelatedFeatures.forEach((relation) => {
      organizationMap.set(relation.id, relation);
    });

    const featureOrganizationsRelations: FeatureOrganizationRaw[] =
      await this.featureOrganizationRepository.findFeaturesOfSpecificOrganizations(
        organizationsWithRelatedFeatures,
      );

    featureOrganizationsRelations.forEach((relation) => {
      organizationMap
        .get(+relation.FeatureOrganizationEntity_organization_id)
        .featureOrganizations.push({
          isEnabled: relation.FeatureOrganizationEntity_is_enabled,
          id: +relation.FeatureOrganizationEntity_feature_id,
        });
    });

    this.logger.verbose(
      `Processed data about ${featureOrganizationsRelations.length} feature-organization relations`,
    );
    return Array.from(organizationMap.values());
  }

  async createFeatureOrganizationRelations(
    featureOrganizationRelations: IFeatureOrganizationRelation[],
  ): Promise<UpdateFeatureOrganizationRelationsResponse> {
    this.logger.log(
      `Request to update data for ${featureOrganizationRelations.length} feature-organization relations`,
    );
    const affectedFeatureOrganizationRelations =
      await this.featureOrganizationRepository.createFeatureOrganizationRelations(
        featureOrganizationRelations,
      );
    return {
      affected: affectedFeatureOrganizationRelations,
    };
  }
}
