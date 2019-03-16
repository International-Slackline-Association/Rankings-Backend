import { Module } from '@nestjs/common';
import { RankingsService } from 'core/athlete/rankings.service';
import { DatabaseModule } from 'dynamodb-streams/database.module';
import { AthleteContestRecordService } from './athlete-contest-record.service';
import { AthleteDetailsRecordService } from './athlete-details-record.service';

@Module({
  imports: [DatabaseModule],
  providers: [AthleteContestRecordService, AthleteDetailsRecordService, RankingsService],
  exports: [AthleteContestRecordService, AthleteDetailsRecordService],
})
export class AthleteRecordsModule {}
