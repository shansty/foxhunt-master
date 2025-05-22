import { Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeactivatedOrganizationEntity } from 'src/common/entities/deactivatedOrganization.entity';
import { RefreshTokenEntity } from 'src/common/entities/refreshToken.entity';
import { DeactivatedOrganizationsRepository } from 'src/common/repositories/deactivated-organizations.repository';
import { RefreshTokensRepository } from 'src/common/repositories/refresh-tokens.repository';
import { DeactivationController } from './deactivation.controller';
import { DeactivationService } from './deactivation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeactivatedOrganizationEntity,
      RefreshTokenEntity,
    ]),
  ],
  controllers: [DeactivationController],
  providers: [
    DeactivationService,
    DeactivatedOrganizationsRepository,
    RefreshTokensRepository,
  ],
  exports: [DeactivationService, RefreshTokensRepository],
})
export class DeactivationModule {}
