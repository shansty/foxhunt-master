import { HttpException, Injectable, Scope } from '@nestjs/common';
import { TokenService } from '../common/services/token.service';
import { UserRepository } from '../common/repositories/user.repository';
import { RegisterUserDto } from '../common/dtos/registerUser.dto';
import { VerifyUserDto } from '../common/dtos/verifyUser.dto';
import { TokenResponse } from '../common/interfaces/token.interface';
import { EMAIL_REGEX } from '../common/constants/commonConstants';

@Injectable({ scope: Scope.REQUEST })
export class RegisterService {
  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository,
  ) {}

  public async registrationMobileAdmin(userDto: RegisterUserDto): Promise<{
    userId: number;
  }> {
    const emailCorrectnessVerificationResult: boolean = EMAIL_REGEX.test(
      userDto.email,
    );

    if (!emailCorrectnessVerificationResult)
      throw new HttpException('Incorrect email address', 400);

    return await this.userRepository.createUser(
      userDto.email,
      userDto.password,
      userDto.firstName,
      userDto.lastName,
      userDto.birthDate,
      userDto.country,
      userDto.city,
    );
  }

  public async verifyUserMobileAdmin(
    verifyUserDto: VerifyUserDto,
  ): Promise<TokenResponse> {
    const tokenPayload = await this.userRepository.activateUser(
      verifyUserDto.id,
      verifyUserDto.token,
    );
    return await this.tokenService.generateTokens(tokenPayload);
  }
}
