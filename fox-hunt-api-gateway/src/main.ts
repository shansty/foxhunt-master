import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exceptions.filters';
import { configService } from './config/config.service';
import { SwaggerConnector } from './common/services/swaggerGenerator.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableCors({
    origin: [
      configService.getOrganizationFrontUrl(),
      configService.getAdminFrontUrl(),
    ],
    credentials: true,
  });
  app.setGlobalPrefix(configService.getApiPrefix());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter());
  SwaggerConnector.generateSwagger(app);
  await app.listen(configService.getPort());
}
bootstrap();
