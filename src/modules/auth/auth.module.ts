import type jwt from 'jsonwebtoken';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AdminProvider } from './auth.model';
import { AUTH } from '@/app.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: AUTH.jwtSecret as jwt.Secret,
      signOptions: {
        expiresIn: AUTH.expiresIn as number,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AdminProvider, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
