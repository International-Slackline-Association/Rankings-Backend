import { Module } from '@nestjs/common';
import { DatabaseModule } from 'api/webapp/database.module';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ContestController],
  providers: [ContestService],
})
export class ContestModule {}
