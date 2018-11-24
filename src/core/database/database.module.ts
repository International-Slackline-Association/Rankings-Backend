import { Module, DynamicModule } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { DDBAthleteDetailsRepoModule } from './dynamodb/athlete/details/athlete.details.module';
import { DDBAthleteContestsRepoModule } from './dynamodb/athlete/contests/athlete.contests.module';
import { DDBAthleteRankingsRepoModule } from './dynamodb/athlete/rankings/athlete.rankings.module';
import { DDBDisciplineContestRepoModule } from './dynamodb/contests/discipline.contest.module';
import { ModuleMetadata } from '@nestjs/common/interfaces';

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
        DDBDisciplineContestRepoModule.withConfig(dynamodbService),
      ],
    };
  }
  static forTest(dynamodbService: IDynamoDBService): ModuleMetadata {
    return {
      imports: [
        DDBAthleteDetailsRepoModule.withConfig(dynamodbService),
        DDBAthleteContestsRepoModule.withConfig(dynamodbService),
        DDBAthleteRankingsRepoModule.withConfig(dynamodbService),
        DDBDisciplineContestRepoModule.withConfig(dynamodbService),
      ],
      providers: [DatabaseService],
      exports: [],
    };
  }
}
