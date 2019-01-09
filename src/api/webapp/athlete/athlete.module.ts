import { Module } from '@nestjs/common';
import { DatabaseModule } from 'api/webapp/database.module';
import { CategoriesService } from 'core/category/categories.service';
import { AthleteController } from './athlete.controller';
import { AthleteService } from './athlete.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AthleteController],
  providers: [AthleteService, CategoriesService],
})
export class AthleteModule {}
