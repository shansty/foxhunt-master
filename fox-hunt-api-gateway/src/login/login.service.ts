import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { TokenResponse } from '../common/interfaces/token.interface';
import { TokenService } from '../common/services/token.service';
import { AxiosService } from '../common/services/axios.service';
import { configService } from '../config/config.service';
import { Request } from 'express';
import { GoogleRequest } from '../common/interfaces/googleRequest.interface';
import { UserRepository } from '../common/repositories/user.repository';
import { LoginUserDto } from '../common/dtos/loginUser.dto';

@Injectable({ scope: Scope.REQUEST })
export class LoginService {
  constructor(
    private axiosService: AxiosService,
    private tokenService: TokenService,
    private userRepository: UserRepository,
  ) {}

  public async logInAdmin(req: Request): Promise<TokenResponse> {
    console.log("logInAdmin method start")
    const { data } = await this.axiosService.sendAxiosRequest(
      req,
      `${configService.getAdminUrl()}/login/authentication`,
    );
    console.log("logInAdmin method end")

    return await this.tokenService.generateTokens(data);
  }

  public async logInMobileAdmin(userDto: LoginUserDto) {
    const data = await this.userRepository.authenticateUser(
      userDto.email,
      userDto.domain,
      userDto.password,
    );
    return await this.tokenService.generateTokens(data);
  }

  public async logInOrganizationAdmin(req: Request): Promise<TokenResponse> {
    const { data } = await this.axiosService.sendAxiosRequest(
      req,
      `${configService.getAdminUrl()}/login/authentication/system`,
    );

    return await this.tokenService.generateTokens(data);
  }

  public async changeOrganization(req: Request): Promise<TokenResponse> {
    const { data } = await this.axiosService.sendAxiosRequest(
      req,
      `${configService.getAdminUrl()}/login/authentication/change-organization`,
    );
    return await this.tokenService.generateTokens(data);
  }

  public async googleLogin(req: GoogleRequest): Promise<TokenResponse> {
    if (!req.user) {
      throw new UnauthorizedException(
        'No google user info was found in the request',
      );
    }
    req.method = 'POST';
    req.body = {
      email: req.user.email,
      domain: req.query.domain,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    };
    const { data } = await this.axiosService.sendAxiosRequest(
      req,
      `${configService.getAdminUrl()}/login/authentication/google`,
    );
    return await this.tokenService.generateTokens(data);
  }
}
