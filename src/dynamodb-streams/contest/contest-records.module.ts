import { Module } from '@nestjs/common';
import { DatabaseModule } from 'dynamodb-streams/database.module';
import { ContestRecordService } from './contest-record.service';

@Module({
  imports: [DatabaseModule],
  providers: [ContestRecordService],
  exports: [ContestRecordService],
})
export class ContestsRecordsModule {}
