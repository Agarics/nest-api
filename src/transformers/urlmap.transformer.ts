/**
 * @file URL transformer
 */

import { GUESTBOOK_POST_ID } from '@/constants/biz.constant';
import * as APP_CONFIG from '@/app.config';

export function getTagUrl(tagSlug: string): string {
  return `${APP_CONFIG.APP.FE_URL}/tag/${tagSlug}`;
}

export function getCategoryUrl(categorySlug: string): string {
  return `${APP_CONFIG.APP.FE_URL}/category/${categorySlug}`;
}

export function getArticleUrl(articleId: string | number): string {
  return `${APP_CONFIG.APP.FE_URL}/article/${articleId}`;
}

export function getGuestbookPageUrl(): string {
  return `${APP_CONFIG.APP.FE_URL}/guestbook`;
}

export function getPermalinkById(id: number): string {
  return id === GUESTBOOK_POST_ID ? getGuestbookPageUrl() : getArticleUrl(id);
}
