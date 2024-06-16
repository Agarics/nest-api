import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';
import {
  HttpResponseSuccess,
  ResponseStatus,
} from '@/interfaces/response.interface';
import { getResponserOptions } from '@/decorators/responser.decorator';
import { HTTP_DEFAULT_SUCCESS_TEXT } from '@/constants/text.constant';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, T | HttpResponseSuccess<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | HttpResponseSuccess<T>> {
    const target = context.getHandler();
    const { successMessage, transform, paginate } = getResponserOptions(target);
    if (!transform) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      map((data: any) => {
        return {
          status: ResponseStatus.Success,
          message: successMessage || HTTP_DEFAULT_SUCCESS_TEXT,
          params: {
            isAuthenticated: request.isAuthenticated(),
            isUnauthenticated: request.isUnauthenticated(),
            url: request.url,
            method: request.method,
            routes: request.params,
            payload: request.$validatedPayload || {},
          },
          result: paginate
            ? {
                data: data.documents,
                pagination: {
                  total: data.total,
                  current_page: data.page,
                  per_page: data.perPage,
                  total_page: data.totalPage,
                },
              }
            : data,
        };
      }),
    );
  }
}
