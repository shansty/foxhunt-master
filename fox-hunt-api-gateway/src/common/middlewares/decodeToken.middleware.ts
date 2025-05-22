import { HttpException, NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { DeactivationService } from '../../deactivation/deactivation.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class DecodeTokenMiddleware implements NestMiddleware {
  constructor(
    private deactivationService: DeactivationService,
    private tokenService: TokenService,
  ) {}

  use = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string = req.headers.authorization?.split(' ')[1];
      if (token) {
        let tokenPayload: JwtPayload =
          this.tokenService.verifyAccessToken(token);
        if (
          tokenPayload.organizationId &&
          (await this.deactivationService.isOrganizationDeactivated(
            tokenPayload.organizationId,
          ))
        ) {
          throw new HttpException(
            {
              message:
                'Organization was deactivated, please contact administrator',
            },
            401,
          );
        }
        tokenPayload = this.tokenService.deleteTokenMetaData(tokenPayload);
        req.headers['payload'] = JSON.stringify(tokenPayload);
      } else {
        req.headers['payload'] = '';
      }
      next();
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        err.message || 'Something went wrong',
        err.status || 401,
      );
    }
  };
}
