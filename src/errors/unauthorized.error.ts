import { UnauthorizedException } from '@nestjs/common';
import { ResponseMessage } from '@/interfaces/response.interface';
import { HTTP_UNAUTHORIZED_TEXT_DEFAULT } from '@/constants/text.constant';

/**
 * @class HttpUnauthorizedError
 * @classdesc 401 -> unauthorized
 * @example new HttpUnauthorizedError('unauthorized')
 * @example new HttpUnauthorizedError('error message', new Error())
 */
export class HttpUnauthorizedError extends UnauthorizedException {
  constructor(message?: ResponseMessage, error?: any) {
    super(message || HTTP_UNAUTHORIZED_TEXT_DEFAULT, error);
  }
}
