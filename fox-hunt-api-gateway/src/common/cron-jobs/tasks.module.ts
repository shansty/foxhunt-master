import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/common/entities/refreshToken.entity';
import { RefreshTokensRepository } from 'src/common/repositories/refresh-tokens.repository';
import { TokenService } from 'src/common/services/token.service';
import { DeactivationService } from 'src/deactivation/deactivation.service';
import { DeactivatedOrganizationEntity } from '../entities/deactivatedOrganization.entity';
import { DeactivatedOrganizationsRepository } from '../repositories/deactivated-organizations.repository';
import { DeactivatedOrganizationsCleanerService } from './deactivatedOrganizationsCleaner.service';
import { RefreshTokenCleanerService } from './refreshTokenCleaner.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RefreshTokenEntity,
      DeactivatedOrganizationEntity,
    ]),
  ],
  controllers: [],
  providers: [
    RefreshTokensRepository,
    TokenService,
    RefreshTokenCleanerService,
    DeactivatedOrganizationsCleanerService,
    DeactivationService,
    DeactivatedOrganizationsRepository,
  ],
})
export class TasksModule {}
