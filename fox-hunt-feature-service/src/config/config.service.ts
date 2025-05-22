import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { AxiosRequestConfig } from 'axios';
import axios from 'axios';

export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string): string | undefined {
    const value = this.env[key];
    if (!value) {
      return undefined;
    }

    return value;
  }

  public getAxiosExternalAuth() {
    return axios(
      `${this.getAdminUrl()}/login/authentication/system`,
      this.getOrganizationServiceAxiosConfig(),
    );
  }

  public getAdminAxiosConfig(): AxiosRequestConfig {
    return {
      method: 'post',
      data: this.getAdminAuthData(),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  public getAdminUrl(): string {
    return `http://${
      this.getValue('AWS_APP_ADMIN_IP') ||
      this.getValue('NETWORK_GATEWAY') ||
      'localhost'
    }:${this.getValue('ADMIN_PORT')}${this.getValue(
      'ADMIN_PREFIX',
    )}${this.getValue('ADMIN_API_VERSION')}`;
  }

  private getAdminAuthData() {
    return {
      email: this.getValue('ADMIN_EMAIL'),
      password: this.getValue('ADMIN_PASSWORD'),
      domain: this.getValue('ADMIN_DOMAIN'),
    };
  }

  public getOrganizationServiceAxiosConfig(): AxiosRequestConfig {
    return {
      method: 'post',
      data: this.getOrganizationServiceAuthData(),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  public getOrganizationServiceUrl(): string {
    return `http://${
      this.getValue('AWS_APP_ORG_PORTAL_IP') ||
      this.getValue('NETWORK_GATEWAY') ||
      'localhost'
    }:${this.getValue('ORGANIZATION_SERVICE_PORT')}${this.getValue(
      'ORGANIZATION_SERVICE_PREFIX',
    )}${this.getValue('ORGANIZATION_SERVICE_API_VERSION')}`;
  }

  private getOrganizationServiceAuthData() {
    return {
      email: this.getValue('SYSTEM_ADMIN_EMAIL'),
      password: this.getValue('SYSTEM_ADMIN_PASSWORD'),
    };
  }

  public getPort(): string {
    return this.getValue('PORT');
  }

  public getApiPrefix(): string {
    return `/api/${this.getValue('API_VERSION')}`;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: ['dist/**/*.entity.js'],
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      retryAttempts: 30,
      retryDelay: 10000,
    };
  }
}

const configService = new ConfigService(process.env);

export { configService };
