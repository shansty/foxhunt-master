import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { configService } from 'src/config/config.service';
import { SwaggerUiOptions } from 'swagger-ui-express';
import swaggerUI = require('swagger-ui-express');
import { swaggerServices } from '../constants/serviceUrls';

class SwaggerConnectorManager {
  private getConfig(): SwaggerUiOptions {
    return {
      explorer: true,
      swaggerOptions: {
        urls: Object.values(swaggerServices).map((service) => ({
          ...service,
          url: `${configService.getGatewayUrl()}${service.url}`,
        })),
      },
    };
  }

  private generateSwaggerCombiner(app: INestApplication) {
    app.use(
      `${configService.getApiPrefix()}/swagger`,
      swaggerUI.serve,
      swaggerUI.setup(null, this.getConfig()),
    );
  }

  public generateSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Fox Hunt API Gateway')
      .setDescription('The fox hunt API Gateway')
      .setVersion('1.0')
      .addTag('Authentication')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'API Gateway',
    };

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(
      `${configService.getApiPrefix()}/gateway/swagger-ui`,
      app,
      document,
      customOptions,
    );
    SwaggerConnector.generateSwaggerCombiner(app);
  }
}

export const SwaggerConnector = new SwaggerConnectorManager();
