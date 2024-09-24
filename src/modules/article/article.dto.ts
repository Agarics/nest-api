/**
 * @file Article DTO
 */

import { IntersectionType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsDefined,
  IsBoolean,
  IsIn,
  IsInt,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';
import {
  PublishState,
  PublicState,
  OriginState,
} from '@/constants/biz.constant';
import { WhenGuest } from '@/decorators/guest.decorator';
import {
  unknownToNumber,
  unknownToBoolean,
} from '@/transformers/value.transformer';
import { DateQueryDTO, KeywordQueryDTO } from '@/models/query.model';
import { PaginateOptionWithHotSortDTO } from '@/models/paginate.model';
import {
  ARTICLE_PUBLISH_STATES,
  ARTICLE_PUBLIC_STATES,
  ARTICLE_ORIGIN_STATES,
  ARTICLE_LANGUAGES,
} from './article.model';

export class ArticlePaginateQueryDTO extends IntersectionType(
  PaginateOptionWithHotSortDTO,
  KeywordQueryDTO,
  DateQueryDTO,
) {
  @WhenGuest({
    only: [PublishState.Published],
    default: PublishState.Published,
  })
  @IsIn(ARTICLE_PUBLISH_STATES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  state?: PublishState;

  @WhenGuest({ only: [PublicState.Public], default: PublicState.Public })
  @IsIn(ARTICLE_PUBLIC_STATES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  public?: PublicState;

  @IsIn(ARTICLE_ORIGIN_STATES)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  origin?: OriginState;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToBoolean(value))
  featured?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tag_slug?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category_slug?: string;

  @IsIn(ARTICLE_LANGUAGES)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lang: string;
}

export class ArticleCalendarQueryDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  timezone?: string;
}

export class ArticleIdsDTO {
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsArray()
  article_ids: string[];
}

export class ArticlesStateDTO extends ArticleIdsDTO {
  @IsIn(ARTICLE_PUBLISH_STATES)
  @IsInt()
  @IsDefined()
  state: PublishState;
}
