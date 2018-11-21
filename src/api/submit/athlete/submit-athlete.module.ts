import { Module } from '@nestjs/common';
import { SubmitAthleteController } from './submit-athlete.controller';
import { DatabaseModule } from 'core/database/database.module';
import { SubmitAthleteService } from './submit-athlete.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SubmitAthleteController],
  providers: [SubmitAthleteService],
})
export class SubmitAthleteModule {}
