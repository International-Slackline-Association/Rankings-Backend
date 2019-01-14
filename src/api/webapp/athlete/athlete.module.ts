import { Module } from '@nestjs/common';
import { DatabaseModule } from 'api/webapp/database.module';
import { AthleteService } from 'core/athlete/athlete.service';
import { RankingsService } from 'core/athlete/rankings.service';
import { CategoriesService } from 'core/category/categories.service';
import { ContestService } from 'core/contest/contest.service';
import { CountryModule } from '../country/country.module';
import { AthleteController } from './athlete.controller';

@Module({
  imports: [DatabaseModule, CountryModule],
  controllers: [AthleteController],
  providers: [AthleteService, RankingsService, ContestService, CategoriesService],
})
export class AthleteModule {}
