import { Module } from '@nestjs/common';
import { SubmitContestResultController } from './submit-contest-result.controller';
import { SubmitContestResultService } from './submit-contest-result.service';
import { DatabaseModule } from 'api/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SubmitContestResultController],
  providers: [SubmitContestResultService],
})
export class SubmitContestModule {}
