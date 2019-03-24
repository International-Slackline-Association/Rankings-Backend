import { Module } from '@nestjs/common';
import { AthleteService } from 'core/athlete/athlete.service';
import { RankingsService } from 'core/athlete/rankings.service';
import { DatabaseModule } from 'dynamodb-streams/database.module';
import { AthleteContestRecordService } from './athlete-contest-record.service';
import { AthleteDetailsRecordService } from './athlete-details-record.service';

@Module({
  imports: [DatabaseModule],
  providers: [AthleteContestRecordService, AthleteDetailsRecordService, RankingsService, AthleteService],
  exports: [AthleteContestRecordService, AthleteDetailsRecordService],
})
export class AthleteRecordsModule {}
