import { HttpException, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { configService } from '../../config/config.service';

@Injectable()
export class GatewayRequests {
  private readonly logger = new Logger(GatewayRequests.name);

  private token: string;

  private getNewToken = async (): Promise<void> => {
    this.logger.log('Request to get token');
    const { data } = await axios.post(
      `${configService.getApiGatewayUrl()}/login/authentication/system`,
      configService.getOrganizationServiceAuthData(),
      { headers: { 'Content-Type': 'application/json' } },
    );
    this.token = data.token;
  };

  private async requestWithTokenExpirationProtection(
    url: string,
    config: AxiosRequestConfig,
  ) {
    try {
      try {
        return await axios.post(url, {}, config);
      } catch (err) {
        if (err.response.status === 401 || err.status === 401) {
          await this.getNewToken();
          config.headers['Authorization'] = `Bearer ${this.token}`;
          return await axios.post(url, {}, config);
        } else {
          throw err;
        }
      }
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        err.response?.data?.message || 'Something went wrong',
        err.response?.status || '500',
      );
    }
  }

  async deactivateOrganization(id: number): Promise<void> {
    await this.requestWithTokenExpirationProtection(
      `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  }

  async activateOrganization(id: number): Promise<any> {
    await this.requestWithTokenExpirationProtection(
      `${configService.getApiGatewayUrl()}/activation/organization/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  }
}
