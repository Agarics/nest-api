/**
 * @file General key value model
 */

import { prop } from '@typegoose/typegoose';
import { IsString, IsNotEmpty } from 'class-validator';

export class KeyValueModel {
  @IsString()
  @IsNotEmpty()
  @prop({ required: false, validate: /\S+/ })
  name: string;

  @IsString()
  @IsNotEmpty()
  @prop({ required: false, validate: /\S+/ })
  value: string;
}
