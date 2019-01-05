import { DynamicModule, Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { ClientOpts } from 'redis';
import { DatabaseService } from './database.service';
import { DDBAthleteContestsRepoModule } from './dynamodb/athlete/contests/athlete.contests.module';
import { DDBAthleteDetailsRepoModule } from './dynamodb/athlete/details/athlete.details.module';
import { DDBAthleteRankingsRepoModule } from './dynamodb/athlete/rankings/athlete.rankings.module';
import { DDBContestRepoModule } from './dynamodb/contests/contest.module';
import { RedisRepositoryModule } from './redis/redis.module';

@Module({
  imports: [],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  public static withConfig(
    dynamodbService: IDynamoDBService,
    redisOpts: ClientOpts,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        DDBAthleteDetailsRepoModule.withConfig(dynamodbService),
        DDBAthleteContestsRepoModule.withConfig(dynamodbService),
        DDBAthleteRankingsRepoModule.withConfig(dynamodbService),
        DDBContestRepoModule.withConfig(dynamodbService),
        RedisRepositoryModule.withConfig(redisOpts),
      ],
    };
  }
  public static forTest(
    dynamodbService: IDynamoDBService,
    redisOpts: ClientOpts,
  ): ModuleMetadata {
    return {
      imports: [
        DDBAthleteDetailsRepoModule.withConfig(dynamodbService),
        DDBAthleteContestsRepoModule.withConfig(dynamodbService),
        DDBAthleteRankingsRepoModule.withConfig(dynamodbService),
        DDBContestRepoModule.withConfig(dynamodbService),
        RedisRepositoryModule.withConfig(redisOpts),
      ],
      providers: [DatabaseService],
      exports: [],
    };
  }
}
