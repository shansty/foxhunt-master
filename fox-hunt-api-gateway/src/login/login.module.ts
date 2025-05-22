import { Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/common/entities/refreshToken.entity';
import { RefreshTokensRepository } from 'src/common/repositories/refresh-tokens.repository';
import { TokenService } from 'src/common/services/token.service';
import { AxiosService } from 'src/common/services/axios.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { DeactivationService } from '../deactivation/deactivation.service';
import { DeactivatedOrganizationsRepository } from '../common/repositories/deactivated-organizations.repository';
import { DeactivatedOrganizationEntity } from '../common/entities/deactivatedOrganization.entity';
import { GoogleStrategy } from 'src/common/strategies/google.strategy';
import { UserRepository } from 'src/common/repositories/user.repository';
import { UserEntity } from 'src/common/entities/user.entity';
import { OrganizationEntity } from 'src/common/entities/organization.entity';
import { OrganizationUserRoleEntity } from 'src/common/entities/organizationUserRole.entity';
import { UserInvitationEntity } from 'src/common/entities/userInvitation.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      RefreshTokenEntity,
      DeactivatedOrganizationEntity,
      UserEntity,
      OrganizationUserRoleEntity,
      OrganizationEntity,
      UserInvitationEntity,
    ]),
  ],
  controllers: [LoginController],
  providers: [
    AxiosService,
    RefreshTokensRepository,
    TokenService,
    LoginService,
    DeactivatedOrganizationsRepository,
    DeactivationService,
    GoogleStrategy,
    UserRepository,
  ],
})
export class LoginModule {}
