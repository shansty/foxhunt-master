import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ExternalAuthService } from '../../auth/externalAuth.service';
import { configService } from '../../config/config.service';
import { IUser } from '../interfaces/user.interface';
import { UserData } from './interfaces/user.interface';

@Injectable()
export class UserServiceRequests {
  private readonly logger = new Logger(UserServiceRequests.name);
  constructor(private externalAuthService: ExternalAuthService) {}

  async getOrganizationAdmin(organizationId: number): Promise<UserData> {
    const url = `${configService.getAdminUrl()}/users/admin?organizationId=${organizationId}`
    const payload = await this.externalAuthService.getPayloadHeader();
    const { data } = await axios.get(
      `${configService.getAdminUrl()}/users/admin?organizationId=${organizationId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          payload: await this.externalAuthService.getPayloadHeader(),
        },
      },
    );
    this.logger.log(
      `Request to get admin of organization with id = ${organizationId}`,
    );
    return data;
  }

  async getUsersByIds(userIds: number[]): Promise<IUser[]> {
    const { data } = await axios.get(
      `${configService.getAdminUrl()}/users?id=${userIds.join(',')}`,
      {
        headers: {
          'Content-Type': 'application/json',
          payload: await this.externalAuthService.getPayloadHeader(),
        },
      },
    );
    this.logger.log(`Request to get users with ids = ${userIds.join(',')}`);
    return data;
  }
}
