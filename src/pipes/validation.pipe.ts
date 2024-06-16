import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationError } from '@/errors/validation.error';
import { VALIDATION_ERROR_DEFAULT } from '@/constants/text.constant';

export const isUnverifiableMetaType = (
  metatype: any,
): metatype is undefined => {
  const basicTypes = [String, Boolean, Number, Array, Object];
  return !metatype || basicTypes.includes(metatype);
};

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, { metatype }: ArgumentMetadata) {
    if (isUnverifiableMetaType(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const messages: string[] = [];
      const pushMessage = (constraints = {}) => {
        messages.push(...Object.values<any>(constraints));
      };
      errors.forEach((error) => {
        if (error.constraints) {
          pushMessage(error.constraints);
        }
        // keep 1 level > Maximum call stack
        if (error.children) {
          error.children.forEach((e) => pushMessage(e.constraints));
        }
      });

      throw new ValidationError(
        `${VALIDATION_ERROR_DEFAULT}: ` + messages.join(', '),
      );
    }
    return object;
  }
}
