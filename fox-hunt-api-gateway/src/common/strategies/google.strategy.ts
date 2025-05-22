import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { configService } from '../../config/config.service';

import { Injectable } from '@nestjs/common';
import { GoogleUser } from '../interfaces/googleUser.interface';
import { GoogleProfile } from '../interfaces/googleProfile.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: configService.getValue('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getValue('GOOGLE_SECRET'),
      callbackURL: configService.getValue('GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
  ): Promise<GoogleUser> {
    const { name, emails, photos } = profile;
    const user: GoogleUser = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    return user;
  }
}
