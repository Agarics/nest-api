import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { isDevEnv } from '@/app.environment';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ scope: 'LoggingInterceptor', time: isDevEnv });

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    if (!isDevEnv) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest<Request>();
    const content = request.method.padStart(6, '_') + '->' + request.url;
    logger.debug('+++ req: ', content);
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          logger.debug('--- res:', content, '|', `${Date.now() - now}ms`),
        ),
      );
  }
}
