/**
 * @file Category module
 */

import { Module } from '@nestjs/common';
import { ArchiveModule } from '@/modules/archive/archive.module';
import { ArticleProvider } from '@/modules/article/article.model';
import { CategoryController } from './category.controller';
import { CategoryProvider } from './category.model';
import { CategoryService } from './category.service';

@Module({
  imports: [ArchiveModule],
  controllers: [CategoryController],
  providers: [ArticleProvider, CategoryProvider, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
