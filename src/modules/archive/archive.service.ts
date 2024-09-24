/**
 * @file Archive service
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@/transformers/model.transformer';
import {
  CacheService,
  CacheManualResult,
} from '@/processors/cache/cache.service';
import { MongooseModel } from '@/interfaces/mongoose.interface';
import { CacheKeys } from '@/constants/cache.constant';
import { SortType } from '@/constants/biz.constant';
import { Category } from '@/modules/category/category.model';
import { Tag } from '@/modules/tag/tag.model';
import {
  Article,
  ARTICLE_LIST_QUERY_GUEST_FILTER,
  ARTICLE_LIST_QUERY_PROJECTION,
} from '@/modules/article/article.model';
import { createLogger } from '@/utils/logger';
import { isDevEnv } from '@/app.environment';

const logger = createLogger({ scope: 'ArchiveService', time: isDevEnv });

export interface ArchiveData {
  tags: Tag[];
  categories: Category[];
  articles: Article[];
}

@Injectable()
export class ArchiveService {
  private archiveCache: CacheManualResult<ArchiveData>;

  constructor(
    private readonly cacheService: CacheService,
    @InjectModel(Tag) private readonly tagModel: MongooseModel<Tag>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>,
    @InjectModel(Category)
    private readonly categoryModel: MongooseModel<Category>,
  ) {
    this.archiveCache = this.cacheService.manual({
      key: CacheKeys.Archive,
      promise: this.getArchiveData.bind(this),
    });
    this.updateCache().catch((error) => {
      logger.warn('init getArchiveData failed!', error);
    });
  }

  private getAllTags(): Promise<Tag[]> {
    return this.tagModel.find().sort({ _id: SortType.Desc }).exec();
  }

  private getAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().sort({ _id: SortType.Desc }).exec();
  }

  private getAllArticles(): Promise<Article[]> {
    return this.articleModel
      .find(ARTICLE_LIST_QUERY_GUEST_FILTER, ARTICLE_LIST_QUERY_PROJECTION)
      .sort({ _id: SortType.Desc })
      .exec();
  }

  private async getArchiveData(): Promise<ArchiveData> {
    try {
      const [tags, categories, articles] = await Promise.all([
        this.getAllTags(),
        this.getAllCategories(),
        this.getAllArticles(),
      ]);
      return { tags, categories, articles };
    } catch (error) {
      logger.warn('getArchiveData failed!', error);
      return {} as any as ArchiveData;
    }
  }

  public getCache() {
    return this.archiveCache.get();
  }

  public updateCache() {
    return this.archiveCache.update();
  }
}
