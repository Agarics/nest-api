/**
 * @file Permission pipe
 */

import { isUndefined } from 'lodash';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Injectable, Inject, Scope, PipeTransform } from '@nestjs/common';
import { HTTP_PARAMS_PERMISSION_ERROR_DEFAULT } from '@/constants/text.constant';
import { HttpForbiddenError } from '@/errors/forbidden.error';
import { getGuestRequestOptions } from '@/decorators/guest.decorator';

/**
 * @class PermissionPipe
 * @classdesc validate metatype class permission & guest default value
 */
@Injectable({ scope: Scope.REQUEST })
export class PermissionPipe implements PipeTransform<any> {
  constructor(@Inject(REQUEST) protected readonly request: Request) {}

  transform(value) {
    // admin > any request params
    if (this.request.isAuthenticated()) {
      return value;
    }

    // guest request params permission config
    const guestRequestOptions = getGuestRequestOptions(value);
    if (!guestRequestOptions) {
      return value;
    }

    // validate guest user request params's field permission
    Object.keys(value).forEach((field) => {
      const v = value[field];
      const o = guestRequestOptions[field];
      if (o?.only?.length) {
        if (!o.only.includes(v)) {
          const message = `${HTTP_PARAMS_PERMISSION_ERROR_DEFAULT}: '${field}=${v}'`;
          const description = `'${field}' must be one of the following values: ${o.only.join(', ')}`;
          throw new HttpForbiddenError(`${message}, ${description}`);
        }
      }
    });

    // set default value for guest request params
    Object.keys(guestRequestOptions).forEach((field) => {
      const v = value[field];
      const o = guestRequestOptions[field];
      if (o?.default) {
        if (isUndefined(v)) {
          value[field] = o.default;
        }
      }
    });

    return value;
  }
}
