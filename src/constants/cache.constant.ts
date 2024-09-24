/**
 * @file Global cache constant
 */

export enum CacheKeys {
  Option = 'option',
  Archive = 'archive',
  AllTags = 'all-tags',
  AllCategories = 'all-categories',
  TodayViewCount = 'today-view-count',
}

export const getDecoratorCacheKey = (key: string) => {
  return `decorator:${key}`;
};

export const getDisqusCacheKey = (key: string) => {
  return `disqus:${key}`;
};
