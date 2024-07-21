/**
 * @file Expansion module
 */

import { Module } from '@nestjs/common';
import { TagModule } from '@/modules/tag/tag.module';
// import { VoteModule } from '@/modules/vote/vote.module'
import { ArticleModule } from '@/modules/article/article.module';
// import { CommentModule } from '@/modules/comment/comment.module'
// import { FeedbackModule } from '@/modules/feedback/feedback.module'
import { ExpansionController } from './expansion.controller';
import { StatisticService } from './expansion.service.statistic';
import { DBBackupService } from './expansion.service.dbbackup';

@Module({
  imports: [
    TagModule,
    // VoteModule,
    ArticleModule,
    // CommentModule,
    // FeedbackModule
  ],
  controllers: [ExpansionController],
  providers: [StatisticService, DBBackupService],
  exports: [StatisticService, DBBackupService],
})
export class ExpansionModule {}
