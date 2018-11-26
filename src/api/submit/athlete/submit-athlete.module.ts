import { Module } from '@nestjs/common';
import { DatabaseModule } from 'core/database/database.module';
import { SubmitAthleteController } from './submit-athlete.controller';
import { SubmitAthleteService } from './submit-athlete.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SubmitAthleteController],
  providers: [SubmitAthleteService],
})
export class SubmitAthleteModule {}
