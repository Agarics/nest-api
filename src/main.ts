import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import helmet from 'helmet';
import passport from 'passport';
import compression from 'compression';
import { AppModule } from './app.module';
import { HttpExpectFilter } from '@/filters/error.filter';
import { ErrorInterceptor } from '@/interceptors/error.interceptors';
import { LoggingInterceptor } from '@/interceptors/logging.interceptors';
import { TransformInterceptor } from '@/interceptors/transform.interceptors';
import logger from '@/utils/logger';
import { APP } from '@/app.config';
import { environment, isProdEnv } from '@/app.environment';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    isProdEnv ? { logger: false } : {},
  );
  app.use(helmet());
  app.use(compression());
  app.use(CookieParser());
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  // 全局的异常过滤器
  app.useGlobalFilters(new HttpExpectFilter());
  // 全局拦截器
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ErrorInterceptor(),
    new LoggingInterceptor(),
  );
  return await app.listen(APP.PORT);
}
bootstrap().then(() => {
  logger.success(
    `${APP.NAME} app is running!`,
    `| env: ${environment}`,
    `| port: ${APP.PORT}`,
    `| ${new Date().toLocaleString()}`,
  );
});
