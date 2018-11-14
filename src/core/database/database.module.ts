import { Module } from '@nestjs/common';
// import { RankingsRepository } from './dynamodb/rankings.repo';
import { DatabaseService } from './database.service';
import { DDBAthleteDetailsRepoModule } from './dynamodb/athlete.details/athlete.details.module';

@Module({
    imports: [DDBAthleteDetailsRepoModule],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
