import { Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IToken } from '../interfaces/token.interface';

@Injectable({ scope: Scope.REQUEST })
export class AuthTokenService {
  constructor(private jwtService: JwtService) {}

  createToken(email: string): IToken {
    const accessToken: string = this.jwtService.sign({ email });
    return {
      token: accessToken,
    };
  }
}
