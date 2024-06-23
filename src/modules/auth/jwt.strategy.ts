// https://docs.nestjs.com/security/authentication#implementing-passport-jwt
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpUnauthorizedError } from '@/errors/unauthorized.error';
import { AuthService } from './auth.service';
import { AUTH } from '@/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AUTH.jwtSecret,
    });
  }

  validate(payload: any) {
    const data = this.authService.validateAuthData(payload);
    if (data) {
      return data;
    } else {
      throw new HttpUnauthorizedError();
    }
  }
}
