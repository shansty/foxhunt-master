import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenResponse } from '../common/interfaces/token.interface';
import { TokenService } from '../common/services/token.service';
import { LoginService } from './login.service';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { refreshTokenConfig } from '../common/swagger/refreshToken';
import { adminPortalExample } from '../common/swagger/adminPortal';
import { orgPortalExample } from '../common/swagger/orgPortal';
import { AuthGuard } from '@nestjs/passport';
import { GoogleRequest } from '../common/interfaces/googleRequest.interface';
import { Body } from '@nestjs/common/decorators';
import { LoginUserDto } from '../common/dtos/loginUser.dto';

@ApiTags('Authentication')
@Controller()
export class LoginController {
  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
  ) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req: Request) {}

  @Get('/login/token')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: GoogleRequest): Promise<TokenResponse> {
    try {
      return await this.loginService.googleLogin(req);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @ApiBody({
    schema: {
      example: adminPortalExample,
    },
  })
  @Post('/login/mobile/authentication')
  async signInMobileAdmin(@Body() loginUserDto: LoginUserDto) {
    try {
      const tokenSet: TokenResponse = await this.loginService.logInMobileAdmin(
        loginUserDto,
      );
      return tokenSet;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @ApiBody({
    schema: {
      example: adminPortalExample,
    },
  })
  @Post('/login/authentication')
  async signInAdmin(@Req() req: Request): Promise<TokenResponse> {
    try {
      return await this.loginService.logInAdmin(req);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @ApiBody({
    schema: {
      example: orgPortalExample,
    },
  })
  @Post('/login/authentication/system')
  async signInOrganizationAdmin(@Req() req: Request): Promise<TokenResponse> {
    try {
      return await this.loginService.logInOrganizationAdmin(req);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @ApiQuery(refreshTokenConfig)
  @Post('/login/logout')
  async logout(@Body() body: { refreshToken: string }): Promise<void> {
    try {
      return await this.tokenService.deleteRefreshToken(body.refreshToken);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @ApiQuery(refreshTokenConfig)
  @Post('/login/refresh')
  async refresh(
    @Query() query: { refreshToken: string },
  ): Promise<TokenResponse> {
    try {
      return await this.tokenService.createTokensByRefresh(query.refreshToken);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Put('/login/current-user/organization')
  async changeOrganization(@Req() req: Request): Promise<TokenResponse> {
    try {
      return await this.loginService.changeOrganization(req);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }
}
