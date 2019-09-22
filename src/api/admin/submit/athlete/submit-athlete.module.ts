import { Module } from '@nestjs/common';
import { DatabaseModule } from 'api/admin/database.module';
import { AthleteService } from 'core/athlete/athlete.service';
import { RankingsService } from 'core/athlete/rankings.service';
import { SubmitAthleteController } from './submit-athlete.controller';
import { SubmitAthleteService } from './submit-athlete.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SubmitAthleteController],
  providers: [SubmitAthleteService, AthleteService, RankingsService],
})
export class SubmitAthleteModule {}
