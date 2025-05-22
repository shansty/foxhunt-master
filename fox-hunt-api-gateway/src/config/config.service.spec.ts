import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DeactivatedOrganizationEntity } from 'src/common/entities/deactivatedOrganization.entity';
import { OrganizationEntity } from 'src/common/entities/organization.entity';
import { OrganizationUserRoleEntity } from 'src/common/entities/organizationUserRole.entity';
import { RefreshTokenEntity } from 'src/common/entities/refreshToken.entity';
import { RoleEntity } from 'src/common/entities/role.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { ConfigService } from './config.service';
import ProcessEnv = NodeJS.ProcessEnv;

jest.mock('dotenv');
jest.mock('fs');

describe('ConfigService', () => {
  let env: ProcessEnv;
  let configService: ConfigService;

  beforeEach(async () => {
    env = {
      PORT: '1111',
      POSTGRES_DATABASE: 'postgres',
      POSTGRES_HOST: 'database-host',
      POSTGRES_PORT: '1234',
      POSTGRES_USER: 'database-password',
      POSTGRES_PASSWORD: 'database-name',
      API_VERSION: 'v1',
      NETWORK_GATEWAY: 'host.docker.internal',
      ORGANIZATION_BACKEND_PORT: '8000',
      ORGANIZATION_BACKEND_URL_PREFIX: '/api/v1',
      ADMIN_BACKEND_PORT: '8080',
      ADMIN_BACKEND_URL_PREFIX: '/api/v1',
      FEATURE_SERVICE_PORT: '8084',
      FEATURE_SERVICE_URL_PREFIX: '/api/v1',
      JWT_ACCESS_TOKEN_EXPIRATION_TIME: '1800000',
    } as ProcessEnv;

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
      const dbType: string = configService.getValue('DATABASE_TYPE');
      expect(dbType).toEqual(env.DATABASE_TYPE);
    });

    it('should return undefined', () => {
      const result: string = configService.getValue('someValue');
      expect(result).toEqual(undefined);
    });
  });

  describe('getGatewayUrl', () => {
    it('should return the gateway URL with localhost as a host', () => {
      const gatewayURL: string = configService.getGatewayUrl();
      expect(gatewayURL).toEqual(
        'http://localhost:' + env.PORT + '/api/' + env.API_VERSION,
      );
    });

    it('should return the gateway URL from environment', () => {
      env.AWS_APP_GATEWAY_IP = '127.0.0.1';
      const gatewayURL: string = configService.getGatewayUrl();
      expect(gatewayURL).toEqual(
        'http://' +
          env.AWS_APP_GATEWAY_IP +
          ':' +
          env.PORT +
          '/api/' +
          env.API_VERSION,
      );
    });
  });

  describe('getTokenExpirationTime', () => {
    it('should return token expiration time', () => {
      const tokenExpirationTime: string =
        configService.getTokenExpirationTime();
      expect(tokenExpirationTime).toEqual(env.JWT_ACCESS_TOKEN_EXPIRATION_TIME);
    });
  });

  describe('getOrganizationUrl', () => {
    it('should return organizationUrl with network gateway as domain name', () => {
      const organizationUrl: string = configService.getOrganizationUrl();
      expect(organizationUrl).toEqual(
        'http://' +
          env.NETWORK_GATEWAY +
          ':' +
          env.ORGANIZATION_BACKEND_PORT +
          env.ORGANIZATION_BACKEND_URL_PREFIX,
      );
    });

    it('should return organizationUrl with AWS_APP_ORG_PORTAL_IP as domain name', () => {
      env.AWS_APP_ORG_PORTAL_IP = '127.0.0.1';
      const organizationUrl: string = configService.getOrganizationUrl();
      expect(organizationUrl).toEqual(
        'http://' +
          env.AWS_APP_ORG_PORTAL_IP +
          ':' +
          env.ORGANIZATION_BACKEND_PORT +
          env.ORGANIZATION_BACKEND_URL_PREFIX,
      );
    });
  });

  describe('getAdminUrl', () => {
    it('should return adminUrl with network gateway as domain name', () => {
      const adminUrl: string = configService.getAdminUrl();
      expect(adminUrl).toEqual(
        'http://' +
          env.NETWORK_GATEWAY +
          ':' +
          env.ADMIN_BACKEND_PORT +
          env.ADMIN_BACKEND_URL_PREFIX,
      );
    });

    it('should return adminUrl with AWS_APP_ADMIN_IP as domain name', () => {
      env.AWS_APP_ADMIN_IP = '127.0.0.1';
      const adminUrl: string = configService.getAdminUrl();
      expect(adminUrl).toEqual(
        'http://' +
          env.AWS_APP_ADMIN_IP +
          ':' +
          env.ADMIN_BACKEND_PORT +
          env.ADMIN_BACKEND_URL_PREFIX,
      );
    });
  });

  describe('getFeatureServiceUrl', () => {
    it('should return featureServiceUrl with network gateway as domain name', () => {
      const featureServiceUrl: string = configService.getFeatureServiceUrl();
      expect(featureServiceUrl).toEqual(
        'http://' +
          env.NETWORK_GATEWAY +
          ':' +
          env.FEATURE_SERVICE_PORT +
          env.FEATURE_SERVICE_URL_PREFIX,
      );
    });

    it('should return featureServiceUrl with AWS_APP_FEATURE_SERVICE_IP as domain name', () => {
      env.AWS_APP_FEATURE_SERVICE_IP = '127.0.0.1';
      const featureServiceUrl: string = configService.getFeatureServiceUrl();
      expect(featureServiceUrl).toEqual(
        'http://' +
          env.AWS_APP_FEATURE_SERVICE_IP +
          ':' +
          env.FEATURE_SERVICE_PORT +
          env.FEATURE_SERVICE_URL_PREFIX,
      );
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
        autoLoadEntities: true,
      });
    });
  });
});
