import { Module } from '@nestjs/common';
import { DatabaseModule } from 'dynamodb-streams/database.module';
import { AthleteContestResultService } from './contest-result.service';

@Module({
  imports: [DatabaseModule],
  providers: [AthleteContestResultService],
  exports: [AthleteContestResultService],
})
export class ContestStreamsModule {}
