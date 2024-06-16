import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { isProdEnv } from '@/app.environment';
import { CROSS_DOMAIN } from '@/app.config';
import {
  HttpResponseError,
  ResponseStatus,
} from '@/interfaces/response.interface';
import { HTTP_ANONYMOUS_TEXT } from '@/constants/text.constant';

@Injectable()
export class OriginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next) {
    // production only
    if (isProdEnv) {
      const { origin, referer } = req.headers;
      const isAllowed = (field) =>
        !field || field.includes(CROSS_DOMAIN.allowedReferer);
      const isAllowedOrigin = isAllowed(origin);
      const isAllowedReferer = isAllowed(referer);
      if (!isAllowedOrigin && !isAllowedReferer) {
        return res.status(HttpStatus.UNAUTHORIZED).jsonp({
          status: ResponseStatus.Error,
          message: HTTP_ANONYMOUS_TEXT,
          error: null,
        } as HttpResponseError);
      }
    }
    return next();
  }
}
