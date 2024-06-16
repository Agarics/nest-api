// HttpException filter

import { isString } from 'lodash';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ExceptionInfo,
  HttpResponseError,
  ResponseStatus,
} from '@/interfaces/response.interface';
import { isDevEnv } from '@/app.environment';
import { UNDEFINED } from '@/constants/value.constant';

@Catch()
export class HttpExpectFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();

    const exceptionStatus =
      exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse: ExceptionInfo =
      exception.getResponse() as ExceptionInfo;
    const errorMessage = isString(errorResponse)
      ? errorResponse
      : errorResponse.message;
    const errorInfo = isString(errorResponse) ? null : errorResponse.error;

    const data: HttpResponseError = {
      status: ResponseStatus.Error,
      message: errorMessage,
      error:
        errorInfo?.message || isString(errorInfo)
          ? errorInfo
          : JSON.stringify(errorInfo),
      debug: isDevEnv ? errorInfo?.stack || exception.stack : UNDEFINED,
    };

    // default 404
    if (exceptionStatus === HttpStatus.NOT_FOUND) {
      data.error = data.error || 'Not Found';
      data.message =
        data.message || `Invalid API: ${request.method} > ${request.url}`;
    }

    return response.status(errorInfo?.status || exceptionStatus).jsonp(data);
  }
}
