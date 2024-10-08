/**
 * @file Tag controller
 */

import lodash from 'lodash';
import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminOnlyGuard } from '@/guards/admin-only.guard';
import { AdminMaybeGuard } from '@/guards/admin-maybe.guard';
import { PermissionPipe } from '@/pipes/permission.pipe';
import { ExposePipe } from '@/pipes/expose.pipe';
import { Responser } from '@/decorators/responser.decorator';
import {
  QueryParams,
  QueryParamsResult,
} from '@/decorators/queryparams.decorator';
import {
  PaginateResult,
  PaginateQuery,
  PaginateOptions,
} from '@/utils/paginate';
import { TagsDTO, TagPaginateQueryDTO } from './tag.dto';
import { TagService } from './tag.service';
import { Tag } from './tag.model';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @UseGuards(AdminMaybeGuard)
  @Responser.paginate()
  @Responser.handle('Get tags')
  getTags(
    @Query(PermissionPipe, ExposePipe) query: TagPaginateQueryDTO,
    @QueryParams() { isUnauthenticated }: QueryParamsResult,
  ): Promise<PaginateResult<Tag>> {
    const { sort, page, per_page, ...filters } = query;
    const paginateQuery: PaginateQuery<Tag> = {};
    const paginateOptions: PaginateOptions = {
      page,
      perPage: per_page,
      dateSort: sort,
    };

    // search
    if (filters.keyword) {
      const trimmed = lodash.trim(filters.keyword);
      const keywordRegExp = new RegExp(trimmed, 'i');
      paginateQuery.$or = [
        { name: keywordRegExp },
        { slug: keywordRegExp },
        { description: keywordRegExp },
      ];
    }

    // paginate
    return this.tagService.paginator(
      paginateQuery,
      paginateOptions,
      isUnauthenticated,
    );
  }

  @Get('all')
  @UseGuards(AdminMaybeGuard)
  @Responser.handle('Get all tags')
  getAllTags(
    @QueryParams() { isAuthenticated }: QueryParamsResult,
  ): Promise<Array<Tag>> {
    return isAuthenticated
      ? this.tagService.getAllTags({ aggregatePublicOnly: false })
      : this.tagService.getAllTagsCache();
  }

  @Post()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Create tag')
  createTag(@Body() tag: Tag): Promise<Tag> {
    return this.tagService.create(tag);
  }

  @Delete()
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete tags')
  delTags(@Body() body: TagsDTO): Promise<any> {
    return this.tagService.batchDelete(body.tag_ids);
  }

  @Put(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Update Tag')
  putTag(
    @QueryParams() { params }: QueryParamsResult,
    @Body() tag: Tag,
  ): Promise<Tag> {
    return this.tagService.update(params.id, tag);
  }

  @Delete(':id')
  @UseGuards(AdminOnlyGuard)
  @Responser.handle('Delete tag')
  delTag(@QueryParams() { params }: QueryParamsResult) {
    return this.tagService.delete(params.id);
  }
}
