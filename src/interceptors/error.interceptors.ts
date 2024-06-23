import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { getResponserOptions } from '@/decorators/responser.decorator';
import { HTTP_DEFAULT_ERROR_TEXT } from '@/constants/text.constant';
import { CustomError } from '@/errors/custom.error';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const target = context.getHandler();
    const { errorCode, errorMessage } = getResponserOptions(target);
    return next.handle().pipe(
      catchError((error) => {
        return throwError(
          () =>
            new CustomError(
              { message: errorMessage || HTTP_DEFAULT_ERROR_TEXT, error },
              errorCode,
            ),
        );
      }),
    );
  }
}
