import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config/config.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filters';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(configService.getApiPrefix());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Fox Hunt Organization Backend')
    .setDescription('The fox hunt organization API')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Organizations')
    .addTag('App User')
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
    customSiteTitle: 'Organization Backend',
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    `${configService.getApiPrefix()}/organization/swagger-ui`,
    app,
    document,
    customOptions,
  );

  await app.listen(configService.getPort());
}
bootstrap();
