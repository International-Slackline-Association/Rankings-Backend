import { Module } from '@nestjs/common';

import { DatabaseModule } from 'api/webapp/database.module';
import { AthleteService } from 'core/athlete/athlete.service';
import { RankingsService } from 'core/athlete/rankings.service';
import { CategoriesService } from 'core/category/categories.service';
import { RankingsController } from './rankings.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [RankingsController],
  providers: [RankingsService, CategoriesService, AthleteService],
})
export class RankingsModule {}
