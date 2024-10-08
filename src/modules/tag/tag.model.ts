/**
 * @file Tag model
 */

import { AutoIncrementID } from '@typegoose/auto-increment';
import { prop, plugin, modelOptions } from '@typegoose/typegoose';
import {
  IsString,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { GENERAL_AUTO_INCREMENT_ID_CONFIG } from '@/constants/increment.constant';
import { getProviderByTypegooseClass } from '@/transformers/model.transformer';
import { mongoosePaginate } from '@/utils/paginate';
import { KeyValueModel } from '@/models/key-value.model';

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, GENERAL_AUTO_INCREMENT_ID_CONFIG)
@modelOptions({
  schemaOptions: {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
})
export class Tag {
  @prop({ unique: true })
  id: number;

  @IsNotEmpty()
  @IsString()
  @prop({ required: true, validate: /\S+/ })
  name: string;

  @Matches(/^[a-zA-Z0-9-_]+$/)
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @prop({ required: true, validate: /^[a-zA-Z0-9-_]+$/, unique: true })
  slug: string;

  @IsString()
  @prop({ default: '' })
  description: string;

  @prop({ default: Date.now, immutable: true })
  created_at?: Date;

  @prop({ default: Date.now })
  updated_at?: Date;

  @IsArray()
  @ArrayUnique()
  @prop({ _id: false, default: [], type: () => [KeyValueModel] })
  extends: KeyValueModel[];

  // for article aggregate
  article_count?: number;
}

export const TagProvider = getProviderByTypegooseClass(Tag);
