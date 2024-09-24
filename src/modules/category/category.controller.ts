/**
 * @file Category controller
 */

import {
  Controller,
  UseGuards,
  Get,
  Put,
  Post,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { AdminOnlyGuard } from '@/guards/admin-only.guard';
import { AdminMaybeGuard } from '@/guards/admin-maybe.guard';
import { PermissionPipe } from '@/pipes/permission.pipe';
import { ExposePipe } from '@/pipes/expose.pipe';
import {
  QueryParams,
  QueryParamsResult,
} from '@/decorators/queryparams.decorator';
import { Responser } from '@/decorators/responser.decorator';
import { PaginateResult } from '@/utils/paginate';
import { CategoriesDTO, CategoryPaginateQueryDTO } from './category.dto';
import { CategoryService } from './category.service';
import { Category } from './category.model';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(AdminMaybeGuard)
  @Responser.paginate()
  @Responser.handle('Get categories')
  getCategories(
    @Query(PermissionPipe, ExposePipe) query: CategoryPaginateQueryDTO,
    @QueryParams() { isUnauthenticated }: QueryParamsResult,
  ): Promise<PaginateResult<Category>> {
    return this.categoryService.paginator(
      {},
      { page: query.page, perPage: query.per_page, dateSort: query.sort },
      isUnauthenticated,
    );
  }

  @Get('all')
  @UseGuards(AdminMaybeGuard)
  @Responser.handle('Get all categories')
  getAllCategories(
    @QueryParams() { isAuthenticated }: QueryParamsResult,
  ): Promise<Array<Category>> {
    return isAuthenticated
      ? this.categoryService.getAllCategories({ aggregatePublicOnly: false })
      : this.categoryService.getAllCategoriesCache();
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Create category')
  createCategory(@Body() category: Category): Promise<Category> {
    return this.categoryService.create(category);
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete categories')
  delCategories(@Body() body: CategoriesDTO) {
    return this.categoryService.batchDelete(body.category_ids);
  }

  @Get(':id')
  @Responser.handle('Get categories tree')
  getCategory(
    @QueryParams() { params }: QueryParamsResult,
  ): Promise<Category[]> {
    return this.categoryService.getGenealogyById(params.id);
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update category')
  putCategory(
    @QueryParams() { params }: QueryParamsResult,
    @Body() category: Category,
  ): Promise<Category> {
    return this.categoryService.update(params.id, category);
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete category')
  delCategory(@QueryParams() { params }: QueryParamsResult) {
    return this.categoryService.delete(params.id);
  }
}
