import { Module } from '@nestjs/common';
import { DatabaseModule } from 'api/webapp/database.module';
import { AthleteController } from './athlete.controller';
import { AthleteService } from './athlete.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AthleteController],
  providers: [AthleteService],
})
export class AthleteModule {}
