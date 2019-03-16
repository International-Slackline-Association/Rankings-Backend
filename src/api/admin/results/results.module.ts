import { Module } from '@nestjs/common';
import { AthleteService } from 'core/athlete/athlete.service';
import { RankingsService } from 'core/athlete/rankings.service';
import { ContestService } from 'core/contest/contest.service';
import { AthleteRecordsModule } from 'dynamodb-streams/athlete/athlete-records.module';
import { DatabaseModule } from '../database.module';
import { ResultsController } from './results.controller';

@Module({
  imports: [DatabaseModule, AthleteRecordsModule ],
  controllers: [ResultsController],
  providers: [ContestService, AthleteService, RankingsService],
})
export class ResultsModule {}
