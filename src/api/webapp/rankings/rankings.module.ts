import { Module } from '@nestjs/common';

import { DatabaseModule } from 'api/webapp/database.module';
import { CategoriesService } from 'core/category/categories.service';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RankingsController],
  providers: [RankingsService, CategoriesService],
})
export class RankingsModule {}
