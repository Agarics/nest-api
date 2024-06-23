import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule, minutes } from '@nestjs/throttler';
import { AppController } from './app.controller';

import { DatabaseModule } from '@/processors/database/database.module';
import { HelperModule } from '@/processors/helper/helper.module';

import { CorsMiddleware } from '@/middlewares/cors.middleware';
import { OriginMiddleware } from '@/middlewares/origin.middleware';

import { ValidationPipe } from '@/pipes/validation.pipe';
import { Request } from 'express';

import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: minutes(5), // 5 minutes = 300s
        limit: 600, // 600 limit
        ignoreUserAgents: [/googlebot/gi, /bingbot/gi, /baidubot/gi],
        skipIf: (context) => {
          // Skip throttle for the front-end server.
          const request = context.switchToHttp().getRequest<Request>();
          // Work only for front-end applications running on the same host machine.
          return (
            request.hostname === 'localhost' ||
            ['127.0.0.1', '::1'].includes(request.ip)
          );
        },
      },
    ]),
    HelperModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
  }
}
