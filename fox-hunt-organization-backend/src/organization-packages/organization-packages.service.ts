import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { groupBy } from 'lodash';
import { OrganizationService } from '../organization/organization.service';
import {
  OrganizationPackage,
  PostOrDeleteOrganizationPackagesDto,
} from './dto/postOrDeleteOrganizationPackages.dto';
import {
  OrganizationPackagesInfo,
  OrganizationPackagesRaw,
} from './interfaces/interfaces';
import { OrganizationPackagesRequests } from '../common/requests/organizationPackages.requests';
import { OrganizationEntity } from 'src/common/entities/organization.entity';

@Injectable()
export class OrganizationPackagesService {
  private readonly logger = new Logger(OrganizationPackagesService.name);
  constructor(
    private organizationService: OrganizationService,
    private organizationPackagesRequest: OrganizationPackagesRequests,
  ) {}

  private async getOrganizationPackagesRaw(): Promise<
    OrganizationPackagesRaw[]
  > {
    this.logger.verbose(
      'Request to admin service to retrieve organization-packages',
    );
    const data: OrganizationPackagesRaw[] =
      await this.organizationPackagesRequest.getSharedOrganizationPackages();
    return data;
  }

  async getOrganizationPackages(): Promise<OrganizationPackagesInfo[]> {
    const organizationsPackages: OrganizationPackagesRaw[] =
      await this.getOrganizationPackagesRaw();
    this.logger.debug(
      `Organization-packages were retrieved: ${organizationsPackages.length}`,
    );
    const groupedOrganizationsPackages = groupBy(
      organizationsPackages,
      (item) => item.organizationId,
    );
    const organizations: OrganizationEntity[] =
      await this.organizationService.getAll();
    const organizationsInfo: OrganizationPackagesInfo[] = organizations.map(
      (organization) => ({
        id: organization.id,
        name: organization.name,
        packages: groupedOrganizationsPackages[organization.id]?.map(
          (item) => ({
            id: item.locationPackageId,
          }),
        ),
      }),
    );
    return organizationsInfo;
  }

  async manageOrganizationPackagesRequests(
    organizationPackages: OrganizationPackage[],
    method: 'post' | 'delete',
  ): Promise<void> {
    try {
      if (organizationPackages.length) {
        await this.organizationPackagesRequest.manageOrganizationPackages(
          method,
          organizationPackages,
        );
      }
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  async manageOrganizationPackages(
    organizationPackages: PostOrDeleteOrganizationPackagesDto,
  ): Promise<void> {
    this.logger.verbose(
      `Request to update organization-packages relations:  
      ${organizationPackages.assignments.length} to create, 
      ${organizationPackages.unassignments.length} to delete`,
    );
    await this.manageOrganizationPackagesRequests(
      organizationPackages.assignments,
      'post',
    );
    await this.manageOrganizationPackagesRequests(
      organizationPackages.unassignments,
      'delete',
    );
  }
}
