import { Module } from '@nestjs/common';
import { OrganizationPackagesController } from './organization-packages.controller';
import { OrganizationPackagesService } from './organization-packages.service';
import { OrganizationModule } from '../organization/organization.module';
import { ExternalAuthModule } from '../auth/externalAuth.module';
import { OrganizationPackagesRequests } from 'src/common/requests/organizationPackages.requests';

@Module({
  imports: [OrganizationModule, ExternalAuthModule],
  controllers: [OrganizationPackagesController],
  providers: [OrganizationPackagesService, OrganizationPackagesRequests],
})
export class OrganizationPackagesModule {}
