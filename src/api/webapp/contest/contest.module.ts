import { Module } from '@nestjs/common';
import { AthleteModule } from 'api/webapp/athlete/athlete.module';
import { DatabaseModule } from 'api/webapp/database.module';
import { CategoriesService } from 'core/category/categories.service';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';

@Module({
  imports: [DatabaseModule, AthleteModule],
  controllers: [ContestController],
  providers: [ContestService, CategoriesService],
})
export class ContestModule {}
