import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import 'dotenv/config';

type EntitiesAndMigrationsOpts = Pick<
  ConnectionOptions,
  'entities' | 'migrations'
>;
let entities: NonNullable<EntitiesAndMigrationsOpts['entities']>;

if (process.env.NODE_ENV === 'lambda') {
  const importAllFunctions = (
    requireContext: __WebpackModuleApi.RequireContext,
  ) =>
    requireContext
      .keys()
      .sort()
      .map((filename) => {
        const required = requireContext(filename);
        return Object.keys(required).reduce((result, exportedKey) => {
          const exported = required[exportedKey];
          if (typeof exported === 'function') {
            return result.concat(exported);
          }
          return result;
        }, [] as any);
      })
      .flat();

  entities = importAllFunctions(
    require.context('./../common/entities/', true, /\.ts$/),
  );
} else {
  entities = ['dist/**/*.entity.js'];
}

export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string): string {
    const value = this.env[key];
    if (!value) {
      return undefined;
    }

    return value;
  }

  public getTokenExpirationTime() {
    return this.getValue('JWT_ACCESS_TOKEN_EXPIRATION_TIME');
  }

  public getGatewayUrl(): string {
    return `http://${
      this.getValue('AWS_APP_GATEWAY_IP') || 'localhost'
    }:${this.getPort()}${this.getApiPrefix()}`;
  }

  public getOrganizationUrl(): string {
    return `http://${
      this.getValue('AWS_APP_ORG_PORTAL_IP') ||
      this.getValue('NETWORK_GATEWAY') ||
      this.getValue('ORGANIZATION_BACKEND_HOST')
    }:${this.getValue('ORGANIZATION_BACKEND_PORT')}${this.getValue(
      'ORGANIZATION_BACKEND_URL_PREFIX',
    )}`;
  }

  public getAdminUrl(): string {
    return `http://${
      this.getValue('AWS_APP_ADMIN_IP') ||
      this.getValue('NETWORK_GATEWAY') ||
      this.getValue('ADMIN_BACKEND_HOST')
    }:${this.getValue('ADMIN_BACKEND_PORT')}${this.getValue(
      'ADMIN_BACKEND_URL_PREFIX',
    )}`;
  }

  public getFeatureServiceUrl(): string {
    return `http://${
      this.getValue('AWS_APP_FEATURE_SERVICE_IP') ||
      this.getValue('NETWORK_GATEWAY') ||
      this.getValue('FEATURE_SERVICE_HOST')
    }:${this.getValue('FEATURE_SERVICE_PORT')}${this.getValue(
      'FEATURE_SERVICE_URL_PREFIX',
    )}`;
  }

  public getOrganizationFrontUrl(): string {
    return `http://${this.getValue(
      'ORGANIZATION_FRONTEND_HOST',
    )}:${this.getValue('ORGANIZATION_FRONTEND_PORT')}`;
  }

  public getAdminFrontUrl(): string {
    return `http://${this.getValue('ADMIN_FRONTEND_HOST')}:${this.getValue(
      'ADMIN_FRONTEND_PORT',
    )}`;
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
      entities: entities,
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      retryAttempts: 30,
      retryDelay: 10000,
      autoLoadEntities: true,
    };
  }
}

const configService = new ConfigService(process.env);

export { configService };
