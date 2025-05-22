import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from './config.service';
import ProcessEnv = NodeJS.ProcessEnv;
import axios, { AxiosResponse } from 'axios';

jest.mock('dotenv');
jest.mock('fs');
jest.mock('axios');

describe('ConfigService', () => {
  let env: ProcessEnv;
  let configService: ConfigService;

  beforeEach(async () => {
    env = {
      POSTGRES_DATABASE: 'postgres',
      POSTGRES_HOST: 'database-host',
      POSTGRES_PORT: '1234',
      POSTGRES_USER: 'database-password',
      POSTGRES_PASSWORD: 'database-name',
      JWT_ACCESS_TOKEN_SECRET: 'access_token_unit_test_secret',
      JWT_ACCESS_TOKEN_EXPIRATION_TIME: 1800000,
      JWT_REFRESH_TOKEN_SECRET: 'refresh_token_unit_test_secret',
      JWT_REFRESH_TOKEN_EXPIRATION_TIME: 86400000,
      ORGANIZATION_SERVICE_PORT: '',
      ORGANIZATION_SERVICE_PREFIX: '',
      ORGANIZATION_SERVICE_API_VERSION: '',
      SYSTEM_ADMIN_EMAIL: '',
      SYSTEM_ADMIN_PASSWORD: '',
      PORT: '8080',
      API_VERSION: 'v1',
      ADMIN_PORT: '8081',
      ADMIN_PREFIX: '/api',
      ADMIN_API_VERSION: 'v1',
    } as unknown as ProcessEnv;

    configService = new ConfigService(env);
  });

  describe('constructor', () => {
    it('should create an instance of ConfigService', () => {
      const testService: ConfigService = new ConfigService(env);
      expect(testService).toEqual({ env: env });
    });
  });

  describe('getValue', () => {
    it('should return a value from environmental variable', () => {
      const dbType: string = configService.getValue('JWT_ACCESS_TOKEN_SECRET');
      expect(dbType).toEqual(env.JWT_ACCESS_TOKEN_SECRET);
    });

    it('should return undefined', () => {
      const result: string = configService.getValue('someValue');
      expect(result).toEqual(undefined);
    });
  });

  describe('getAxiosExternalAuth', () => {
    it('should return a mocked response ', async () => {
      const mockResponse = { data: 'unittest' };
      (axios as unknown as jest.Mock).mockImplementationOnce(async () => {
        return mockResponse;
      });
      const response: AxiosResponse =
        await configService.getAxiosExternalAuth();
      expect(axios).toHaveBeenCalledTimes(1);
      expect(axios).toHaveBeenCalledWith(
        `${configService.getAdminUrl()}/login/authentication/system`,
        configService.getOrganizationServiceAxiosConfig(),
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('getAdminAxiosConfig', () => {
    it('should return the configuration of axios request', () => {
      const axiosConfig = configService.getAdminAxiosConfig();
      expect(axiosConfig).toEqual({
        method: 'post',
        data: {
          email: env.ADMIN_EMAIL,
          password: env.ADMIN_PASSWORD,
          domain: env.ADMIN_DOMAIN,
        },
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('getAdminUrl', () => {
    it('should return adminUrl with network gateway as domain name', () => {
      const adminUrl: string = configService.getAdminUrl();
      expect(adminUrl).toEqual(
        'http://localhost:' +
          env.ADMIN_PORT +
          env.ADMIN_PREFIX +
          env.ADMIN_API_VERSION,
      );
    });

    it('should return adminUrl with network gateway as domain name', () => {
      env.NETWORK_GATEWAY = '127.0.0.1';
      const adminUrl: string = configService.getAdminUrl();
      expect(adminUrl).toEqual(
        'http://' +
          env.NETWORK_GATEWAY +
          ':' +
          env.ADMIN_PORT +
          env.ADMIN_PREFIX +
          env.ADMIN_API_VERSION,
      );
    });

    it('should return adminUrl with AWS_APP_ADMIN_IP as domain name', () => {
      env.AWS_APP_ADMIN_IP = '127.0.0.1';
      const adminUrl: string = configService.getAdminUrl();
      expect(adminUrl).toEqual(
        'http://' +
          env.AWS_APP_ADMIN_IP +
          ':' +
          env.ADMIN_PORT +
          env.ADMIN_PREFIX +
          env.ADMIN_API_VERSION,
      );
    });
  });

  describe('getOrganizationServiceAxiosConfig', () => {
    it('should return axios configuration of getOrganizationService request', () => {
      const axiosConfig = configService.getOrganizationServiceAxiosConfig();
      expect(axiosConfig).toEqual({
        method: 'post',
        data: {
          email: env.ADMIN_EMAIL,
          password: env.ADMIN_PASSWORD,
        },
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('getPort', () => {
    it('should return port value from environmental variable', () => {
      const port: string = configService.getPort();
      expect(port).toEqual(env.PORT);
    });
  });

  describe('getApiPrefix', () => {
    it('should return api prefix from environmental variable', () => {
      const apiPrefix: string = configService.getApiPrefix();
      expect(apiPrefix).toEqual('/api/' + env.API_VERSION);
    });
  });

  describe('getTypeOrmConfig', () => {
    it('should return typeOrmConfig', () => {
      const typeOrmConfig: TypeOrmModuleOptions =
        configService.getTypeOrmConfig();
      expect(typeOrmConfig).toEqual({
        type: 'postgres',
        host: env.POSTGRES_HOST,
        port: parseInt(env.POSTGRES_PORT),
        username: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DATABASE,
        entities: ['dist/**/*.entity.js'],
        migrationsTableName: 'migration',
        migrations: ['src/migration/*.ts'],
        retryAttempts: 30,
        retryDelay: 10000,
      });
    });
  });
});
