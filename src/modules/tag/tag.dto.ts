/**
 * @file Tag dto
 */

import { IntersectionType } from '@nestjs/mapped-types';
import { IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { PaginateOptionDTO } from '@/models/paginate.model';
import { KeywordQueryDTO } from '@/models/query.model';

export class TagPaginateQueryDTO extends IntersectionType(
  PaginateOptionDTO,
  KeywordQueryDTO,
) {}

export class TagsDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  tag_ids: string[];
}
