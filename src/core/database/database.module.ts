import { Module, DynamicModule } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { DDBAthleteDetailsRepoModule } from './dynamodb/athlete/details/athlete.details.module';
import { DDBAthleteContestsRepoModule } from './dynamodb/athlete/contests/athlete.contests.module';
import { DDBAthleteRankingsRepoModule } from './dynamodb/athlete/rankings/athlete.rankings.module';
import { DDBContestsRepoModule } from './dynamodb/contests/contests.module';
import { DDBDisciplineContestRepoModule } from './dynamodb/contests/discipline/discipline.contest.module';

@Module({
  imports: [],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        DDBAthleteDetailsRepoModule.withConfig(dynamodbService),
        DDBAthleteContestsRepoModule.withConfig(dynamodbService),
        DDBAthleteRankingsRepoModule.withConfig(dynamodbService),
        DDBContestsRepoModule.withConfig(dynamodbService),
        DDBDisciplineContestRepoModule.withConfig(dynamodbService),
      ],
    };
  }
}
