/**
 * @file Category dto
 */

import { IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { PaginateOptionDTO } from '@/models/paginate.model';

export class CategoryPaginateQueryDTO extends PaginateOptionDTO {}

export class CategoriesDTO {
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  category_ids: string[];
}
