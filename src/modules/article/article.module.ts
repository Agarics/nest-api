/**
 * @file Article module
 */

import { Module } from '@nestjs/common';
import { ArchiveModule } from '@/modules/archive/archive.module';
import { CategoryModule } from '@/modules/category/category.module';
import { TagModule } from '@/modules/tag/tag.module';
import { ArticleController } from './article.controller';
import { ArticleProvider } from './article.model';
import { ArticleService } from './article.service';

@Module({
  imports: [ArchiveModule, CategoryModule, TagModule],
  controllers: [ArticleController],
  providers: [ArticleProvider, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
