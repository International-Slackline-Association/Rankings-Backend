import { Module } from '@nestjs/common';
import { DatabaseModule } from 'api/admin/database.module';
import { ContestPointsCalculatorService } from 'core/contest/points-calculator.service';
import { SubmitContestResultController } from './submit-contest-result.controller';
import { SubmitContestResultService } from './submit-contest-result.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SubmitContestResultController],
  providers: [SubmitContestResultService, ContestPointsCalculatorService],
})
export class SubmitContestResultsModule {}
