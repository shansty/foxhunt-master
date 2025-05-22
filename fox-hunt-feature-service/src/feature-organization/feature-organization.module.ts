import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalAuthModule } from 'src/auth/externalAuth.module';
import { OrganizationServiceRequests } from 'src/common/requests/organization-service.requests';
import { FeatureOrganizationEntity } from 'src/feature-organization/repository/feature-organization.entity';
import { FeatureOrganizationRepository } from 'src/feature-organization/repository/featureOrganization.repository';
import { FeatureModule } from 'src/feature/feature.module';
import { FeatureOrganizationController } from './feature-organization.controller';
import { FeatureOrganizationService } from './feature-organization.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeatureOrganizationEntity]),
    ExternalAuthModule,
    FeatureModule,
  ],
  controllers: [FeatureOrganizationController],
  providers: [
    FeatureOrganizationService,
    FeatureOrganizationRepository,
    OrganizationServiceRequests,
  ],
})
export class FeatureOrganizationModule {}
