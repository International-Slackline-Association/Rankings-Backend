import { Module } from '@nestjs/common';
import { SubmitContestController } from './submit-contest.controller';
import { SubmitContestService } from './submit-contest.service';
import { DatabaseModule } from 'api/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SubmitContestController],
  providers: [SubmitContestService],
})
export class SubmitContestModule {}
