import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { OrganizationPackage } from 'src/organization-packages/dto/postOrDeleteOrganizationPackages.dto';
import { OrganizationPackagesRaw } from 'src/organization-packages/interfaces/interfaces';
import { ExternalAuthService } from '../../auth/externalAuth.service';
import { configService } from '../../config/config.service';

@Injectable()
export class OrganizationPackagesRequests {
  private readonly logger = new Logger(OrganizationPackagesRequests.name);
  constructor(private externalAuthService: ExternalAuthService) {}

  async manageOrganizationPackages(
    method: 'post' | 'delete',
    organizationPackages: OrganizationPackage[],
  ): Promise<void> {
    this.logger.log(
      `Request to manage organization packages with method ${method}`,
    );
    await axios(`${configService.getAdminUrl()}/organization-packages`, {
      method: method,
      data: { assignments: organizationPackages },
      headers: {
        'Content-Type': 'application/json',
        payload: await this.externalAuthService.getPayloadHeader(),
      },
    });
  }

  async getSharedOrganizationPackages(): Promise<OrganizationPackagesRaw[]> {
    this.logger.log(`Request to get shared organization packages`);
    const { data } = await axios.get(
      `${configService.getAdminUrl()}/organization-packages?accessType=SHARED`,
      {
        headers: {
          'Content-Type': 'application/json',
          payload: await this.externalAuthService.getPayloadHeader(),
        },
      },
    );
    return data;
  }
}
