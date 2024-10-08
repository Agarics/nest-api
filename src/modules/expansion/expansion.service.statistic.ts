/**
 * @file Expansion statistic service
 */

import schedule from 'node-schedule';
import { Injectable } from '@nestjs/common';
import { CacheService } from '@/processors/cache/cache.service';
import { EmailService } from '@/processors/helper/helper.service.email';
import { ArticleService } from '@/modules/article/article.service';
// import { VoteTarget, VoteType } from '@/modules/vote/vote.model'
// import { VoteService } from '@/modules/vote/vote.service'
// import { CommentService } from '@/modules/comment/comment.service'
// import { FeedbackService } from '@/modules/feedback/feedback.service'
import { TagService } from '@/modules/tag/tag.service';
import { getTodayViewsCount, resetTodayViewsCount } from './expansion.helper';
import { createLogger } from '@/utils/logger';
import { isDevEnv } from '@/app.environment';
import * as APP_CONFIG from '@/app.config';

const logger = createLogger({ scope: 'StatisticService', time: isDevEnv });

const DEFAULT_STATISTIC = Object.freeze({
  tags: null,
  articles: null,
  comments: null,
  totalViews: null,
  totalLikes: null,
  todayViews: null,
  averageEmotion: null,
});

export type Statistic = Record<keyof typeof DEFAULT_STATISTIC, number | null>;

@Injectable()
export class StatisticService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly emailService: EmailService,
    private readonly articleService: ArticleService,
    // private readonly commentService: CommentService,
    // private readonly feedbackService: FeedbackService,
    // private readonly voteService: VoteService,
    private readonly tagService: TagService,
  ) {
    // daily data cleaning at 00:01
    schedule.scheduleJob('1 0 0 * * *', async () => {
      try {
        const todayViewsCount = await getTodayViewsCount(this.cacheService);
        await this.dailyStatisticsTask(todayViewsCount);
      } finally {
        resetTodayViewsCount(this.cacheService).catch((error) => {
          logger.warn('reset TODAY_VIEWS failed!', error);
        });
      }
    });
  }

  private async dailyStatisticsTask(todayViews: number) {
    // const now = new Date()
    // const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    // const createdAt = { $gte: oneDayAgo, $lt: now }
    // const [todayNewComments, todayArticleUpVotes, todayCommentUpVotes, todayCommentDownVotes] = await Promise.all([
    //   this.commentService.countDocuments({ created_at: createdAt }),
    //   this.voteService.countDocuments({
    //     created_at: createdAt,
    //     target_type: VoteTarget.Post,
    //     vote_type: VoteType.Upvote
    //   }),
    //   this.voteService.countDocuments({
    //     created_at: createdAt,
    //     target_type: VoteTarget.Comment,
    //     vote_type: VoteType.Upvote
    //   }),
    //   this.voteService.countDocuments({
    //     created_at: createdAt,
    //     target_type: VoteTarget.Comment,
    //     vote_type: VoteType.Downvote
    //   })
    // ])

    const emailContents = [
      `Today views: ${todayViews}`,
      // `Today new comments: ${todayNewComments}`,
      // `Today new post votes: +${todayArticleUpVotes}`,
      // `Today new comment votes: +${todayCommentUpVotes}, -${todayCommentDownVotes}`
    ];

    this.emailService.sendMailAs(APP_CONFIG.APP.NAME, {
      to: APP_CONFIG.APP.ADMIN_EMAIL,
      subject: 'Daily Statistics',
      text: emailContents.join('\n'),
      html: emailContents.map((text) => `<p>${text}</p>`).join('\n'),
    });
  }

  public getStatistic(publicOnly: boolean) {
    const resultData: Statistic = { ...DEFAULT_STATISTIC };
    const tasks = Promise.all([
      this.tagService.getTotalCount().then((value) => {
        resultData.tags = value;
      }),
      this.articleService.getTotalCount(publicOnly).then((value) => {
        resultData.articles = value;
      }),
      // this.commentService.getTotalCount(publicOnly).then((value) => {
      //   resultData.comments = value
      // }),
      // this.feedbackService.getRootFeedbackAverageEmotion().then((value) => {
      //   resultData.averageEmotion = value ?? 0
      // }),
      this.articleService.getMetaStatistic().then((value) => {
        resultData.totalViews = value?.totalViews ?? 0;
        resultData.totalLikes = value?.totalLikes ?? 0;
      }),
      getTodayViewsCount(this.cacheService).then((value) => {
        resultData.todayViews = value;
      }),
    ]);

    return tasks
      .then(() => resultData)
      .catch((error) => {
        logger.warn('getStatistic task partial failed!', error);
        return Promise.resolve(resultData);
      });
  }
}
