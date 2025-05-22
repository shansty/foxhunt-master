import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exceptions.filters';
import { configService } from './config/config.service';
import { SwaggerConnector } from './common/services/swaggerGenerator.service';
import cookieParser from 'cookie-parser';
import { Callback, Context, Handler } from 'aws-lambda';
import { configure as serverlessExpress } from '@vendia/serverless-express';

let server: Handler;

async function bootstrap(): Promise<Handler> {
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
  app.use(cookieParser());
  SwaggerConnector.generateSwagger(app);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
