import { configService } from '../../config/config.service';
import {
  Logger,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokensRepository } from '../repositories/refresh-tokens.repository';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { TokenResponse } from '../interfaces/token.interface';
import type { DeleteResult } from 'typeorm';

import { DeactivationService } from '../../deactivation/deactivation.service';
import { errorCodes } from '../../common/constants/errorCodes';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  constructor(
    private refreshTokensRepository: RefreshTokensRepository,
    private deactivationService: DeactivationService,
  ) {}

  public async generateTokens(
    tokenPayload: JwtPayload,
  ): Promise<TokenResponse> {
    this.logger.debug(
      `Tokens were generated for user: ${
        tokenPayload?.email || 'user was not found in payload'
      }`,
    );
    return {
      token: this.generateAccessToken(tokenPayload),
      refreshToken: await this.generateRefreshToken(tokenPayload),
      expiresInSeconds: '1800',
      tokenType: 'customToken',
    };
  }

  private generateAccessToken(tokenPayload: JwtPayload): string {
    const accessToken: string = sign(
      tokenPayload,
      configService.getValue('JWT_ACCESS_TOKEN_SECRET'),
      {
        expiresIn: configService.getValue('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    );
    return accessToken;
  }

  private async generateRefreshToken(
    tokenPayload: JwtPayload,
  ): Promise<string> {
    const refreshTokenId: number =
      await this.refreshTokensRepository.createRefreshToken();
    tokenPayload['refreshTokenId'] = refreshTokenId;
    const refreshToken: string = sign(
      tokenPayload,
      configService.getValue('JWT_REFRESH_TOKEN_SECRET'),
      {
        expiresIn: configService.getValue('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      },
    );
    return refreshToken;
  }

  public verifyAccessToken(token: string): JwtPayload {
    try {
      return verify(
        token,
        configService.getValue('JWT_ACCESS_TOKEN_SECRET'),
      ) as JwtPayload;
    } catch (err) {
      throw new UnauthorizedException(errorCodes.notVerifiedAccessToken);
    }
  }

  public verifyRefreshToken(token: string): JwtPayload {
    try {
      return verify(
        token,
        configService.getValue('JWT_REFRESH_TOKEN_SECRET'),
      ) as JwtPayload;
    } catch (err) {
      throw new UnauthorizedException('Refresh token was not validated');
    }
  }

  public async createTokensByRefresh(token: string): Promise<TokenResponse> {
    const tokenPayload: JwtPayload = this.verifyRefreshToken(token);

    if (
      await this.deactivationService.isOrganizationDeactivated(
        tokenPayload.organizationId,
      )
    ) {
      throw new HttpException(
        {
          message: 'Organization was deactivated, please contact administrator',
        },
        401,
      );
    }

    const currentDateInSeconds = Math.floor(Date.now() / 1000);
    if (currentDateInSeconds > tokenPayload.exp) {
      throw new HttpException({ message: 'Refresh token expired' }, 401);
    }
    const deleteTokenResult =
      await this.refreshTokensRepository.deleteRefreshTokenById(
        tokenPayload.refreshTokenId,
      );
    if (deleteTokenResult.affected === 0) {
      throw new HttpException(
        { message: 'Refresh token was used before' },
        401,
      );
    }

    return this.generateTokens(this.deleteTokenMetaData(tokenPayload));
  }

  public async deleteRefreshToken(token: string): Promise<void> {
    const tokenPayload: JwtPayload = this.verifyRefreshToken(token);
    await this.refreshTokensRepository.deleteRefreshTokenById(
      tokenPayload.refreshTokenId,
    );
  }

  public deleteTokenMetaData(tokenPayload: JwtPayload): JwtPayload {
    delete tokenPayload.exp;
    delete tokenPayload.iat;
    delete tokenPayload.refreshTokenId;
    delete tokenPayload.token_type;
    return tokenPayload;
  }

  public async deleteRefreshTokensByTimestamp(): Promise<DeleteResult> {
    const start_date = new Date(
      Date.now() - +configService.getValue('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    );

    return await this.refreshTokensRepository.deleteRefreshTokensByTimestamp(
      start_date,
    );
  }
}
