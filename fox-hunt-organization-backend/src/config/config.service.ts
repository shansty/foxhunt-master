import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import axios, { AxiosRequestConfig } from 'axios';

import 'dotenv/config';

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string): string {
    const value = this.env[key];
    if (!value) {
      return undefined;
    }

    return value;
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

  public getAxiosExternalAuth() {
    console.log("getAxiosExternalAuth started")
    return axios(
      `${this.getAdminUrl()}/login/authentication/system`,
      this.getOrganizationServiceAxiosConfig(),
    );
  }

  public getOrganizationServiceAxiosConfig(): AxiosRequestConfig {
     console.log("getOrganizationServiceAxiosConfig started")
    return {
      method: 'post',
      data: this.getOrganizationServiceAuthData(),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  public getOrganizationServiceAuthData() {
    return {
      email: this.getValue('SYSTEM_ADMIN_EMAIL'),
      password: this.getValue('SYSTEM_ADMIN_PASSWORD'),
    };
  }

  public getApiGatewayUrl(): string {
    return `http://${
      this.getValue('AWS_APP_GATEWAY_IP') ||
      this.getValue('NETWORK_GATEWAY') ||
      'localhost'
    }:${this.getValue('API_GATEWAY_PORT')}${this.getValue(
      'API_GATEWAY_PREFIX',
    )}${this.getValue('API_GATEWAY_VERSION')}`;
  }

  public getAdminAuthData() {
    return {
      email: this.getValue('ADMIN_EMAIL'),
      password: this.getValue('ADMIN_PASSWORD'),
      domain: this.getValue('ADMIN_DOMAIN'),
    };
  }

  public getPort(): string {
    return this.getValue('PORT');
  }

  public getSecretKey(): string {
    return this.getValue('SECRETKEY');
  }

  public getExpiresIn(): string {
    return this.getValue('EXPIRESIN');
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