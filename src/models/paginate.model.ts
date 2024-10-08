/**
 * @file General extend model
 */

import { IsIn, IsInt, IsOptional, IsNotEmpty, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortType } from '@/constants/biz.constant';
import { unknownToNumber } from '@/transformers/value.transformer';

export class PaginateBaseOptionDTO {
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  page?: number;

  @Min(1)
  @Max(50)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  per_page?: number;
}

export class PaginateOptionDTO extends PaginateBaseOptionDTO {
  @IsIn([SortType.Asc, SortType.Desc])
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  sort?: SortType.Asc | SortType.Desc;
}

export class PaginateOptionWithHotSortDTO extends PaginateBaseOptionDTO {
  @IsIn([SortType.Asc, SortType.Desc, SortType.Hottest])
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  sort?: SortType;
}
