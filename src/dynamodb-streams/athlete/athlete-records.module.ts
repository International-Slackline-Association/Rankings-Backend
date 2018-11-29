import { Module } from '@nestjs/common';
import { DatabaseModule } from 'dynamodb-streams/database.module';
import { AthleteContestRecordService } from './athlete-contest-record.service';
import { AthleteDetailsRecordService } from './athlete-details-record.service';

@Module({
  imports: [DatabaseModule],
  providers: [AthleteContestRecordService, AthleteDetailsRecordService],
  exports: [AthleteContestRecordService, AthleteDetailsRecordService],
})
export class AthleteRecordsModule {}
