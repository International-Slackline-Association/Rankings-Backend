import { Module } from '@nestjs/common';

import { AthleteModule } from 'api/webapp/athlete/athlete.module';
import { DatabaseModule } from 'api/webapp/database.module';
import { AthleteService } from 'core/athlete/athlete.service';
import { CategoriesService } from 'core/category/categories.service';
import { ContestService } from 'core/contest/contest.service';
import { CountryModule } from '../country/country.module';
import { ContestController } from './contest.controller';

@Module({
  imports: [DatabaseModule, AthleteModule, CountryModule],
  controllers: [ContestController],
  providers: [ContestService, AthleteService, CategoriesService],
})
export class ContestModule {}
