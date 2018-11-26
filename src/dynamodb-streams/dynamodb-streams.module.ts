import { Module } from '@nestjs/common';
import { ContestStreamsModule } from './contest/contest-streams.module';
import { DynamoDBStreamsService } from './dynamodb-streams.service';

@Module({
  imports: [ContestStreamsModule],
  providers: [DynamoDBStreamsService],
})
export class DynamoDBStreamsModule {}
