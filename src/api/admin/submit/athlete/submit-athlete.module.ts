import { Module } from '@nestjs/common';
import { DatabaseModule } from 'api/admin/database.module';
import { SubmitAthleteController } from './submit-athlete.controller';
import { SubmitAthleteService } from './submit-athlete.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SubmitAthleteController],
  providers: [SubmitAthleteService],
})
export class SubmitAthleteModule {}
