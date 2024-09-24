/**
 * @file Archive module
 */

import { Module } from '@nestjs/common';
import { CategoryProvider } from '@/modules/category/category.model';
import { ArticleProvider } from '@/modules/article/article.model';
import { TagProvider } from '@/modules/tag/tag.model';
import { ArchiveController } from './archive.controller';
import { ArchiveService } from './archive.service';

@Module({
  controllers: [ArchiveController],
  providers: [TagProvider, CategoryProvider, ArticleProvider, ArchiveService],
  exports: [ArchiveService],
})
export class ArchiveModule {}
