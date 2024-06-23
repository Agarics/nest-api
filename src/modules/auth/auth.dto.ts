/**
 * @file Auth DTO
 * @module module/auth/dto
 */

import { IsString, IsDefined, IsNotEmpty } from 'class-validator';
import { Admin } from './auth.model';

export class AuthLoginDTO {
  @IsString({ message: 'password must be string type' })
  @IsNotEmpty({ message: 'password?' })
  @IsDefined()
  password: string;
}

export class AdminUpdateDTO extends Admin {
  new_password?: string;
}
