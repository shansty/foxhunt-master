import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationEntity } from '../common/entities/organization.entity';
import { UserFeedbackEntity } from 'src/common/entities/user-feedback.entity';
import { GatewayRequests } from 'src/common/requests/gateway.requests';
import { ExternalAuthModule } from '../auth/externalAuth.module';
import { UserServiceRequests } from 'src/common/requests/userService.requests';
import { OrganizationRepository } from 'src/organization/repository/organization.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationEntity, UserFeedbackEntity]),
    ExternalAuthModule,
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    GatewayRequests,
    UserServiceRequests,
    OrganizationRepository,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
