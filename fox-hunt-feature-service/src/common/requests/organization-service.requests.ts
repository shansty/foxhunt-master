import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ExternalAuthService } from 'src/auth/externalAuth.service';
import { configService } from '../../config/config.service';
import { OrganizationRequestData } from './interfaces/organization.interface';

@Injectable()
export class OrganizationServiceRequests {
  private readonly logger = new Logger(OrganizationServiceRequests.name);
  constructor(private externalAuthService: ExternalAuthService) {}

  async getOrganizations(
    organizationFilter?: any,
  ): Promise<OrganizationRequestData[]> {
    try {
      const url = `${configService.getOrganizationServiceUrl()}/organizations`;
      const { data } = await axios(url, {
        params: organizationFilter,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          payload: await this.externalAuthService.getPayloadHeader(),
        },
      });
      this.logger.log(
        `${data.length} organizations were received from organization service`,
      );
      return data;
    } catch (err) {
      if (err.response.data) throw new BadRequestException(err.response.data);
      throw err;
    }
  }
}
