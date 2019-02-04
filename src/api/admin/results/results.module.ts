import { Module } from '@nestjs/common';
import { AthleteService } from 'core/athlete/athlete.service';
import { ContestService } from 'core/contest/contest.service';
import { DatabaseModule } from '../database.module';
import { ResultsController } from './results.controller';

@Module({
  imports: [DatabaseModule ],
  controllers: [ResultsController],
  providers: [ContestService, AthleteService, ],
})
export class ResultsModule {}
