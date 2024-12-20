import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const backendUrl = configService.get('BACKEND_URL');
    const callbackUrl = new URL('/auth/google/callback', backendUrl).toString();

    console.log('callbackUrl', callbackUrl);

    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: callbackUrl,
      scope: ['email', 'profile'],
      prompt: 'select_account',
      accessType: 'offline',
      responseType: 'code',
      validateIssuer: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { name, emails, photos } = profile;
    return {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
  }
}
