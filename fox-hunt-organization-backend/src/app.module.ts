import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';

import { OrganizationModule } from './organization/organization.module';
import { UserFeedbackModule } from './user-feedback/user-feedback.module';
import { OrganizationPackagesModule } from './organization-packages/organization-packages.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrganizationModule,
    UserFeedbackModule,
    OrganizationPackagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
