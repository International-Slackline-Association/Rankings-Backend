import { Module } from '@nestjs/common';
import { AthleteRecordsModule } from './athlete/athlete-records.module';
import { DynamoDBStreamsService } from './dynamodb-streams.service';

@Module({
  imports: [AthleteRecordsModule],
  providers: [DynamoDBStreamsService],
})
export class DynamoDBStreamsModule {}
