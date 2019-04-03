import { Module } from '@nestjs/common';
import { AthleteService } from 'core/athlete/athlete.service';
import { RankingsService } from 'core/athlete/rankings.service';
import { CronJobService } from './cron-job.service';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CronJobService, RankingsService, AthleteService],
})
export class CronJobModule {}
