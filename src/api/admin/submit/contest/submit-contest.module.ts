import { Module } from '@nestjs/common';
import { DatabaseModule } from 'api/admin/database.module';
import { SubmitContestController } from './submit-contest.controller';
import { SubmitContestService } from './submit-contest.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SubmitContestController],
  providers: [SubmitContestService],
})
export class SubmitContestModule {}
