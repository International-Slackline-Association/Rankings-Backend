import { Module } from '@nestjs/common';
import { AthleteRecordsModule } from './athlete/athlete-records.module';
import { ContestsRecordsModule } from './contest/contest-records.module';
import { DynamoDBStreamsService } from './dynamodb-streams.service';

@Module({
  imports: [AthleteRecordsModule, ContestsRecordsModule],
  providers: [DynamoDBStreamsService],
})
export class DynamoDBStreamsModule {}
