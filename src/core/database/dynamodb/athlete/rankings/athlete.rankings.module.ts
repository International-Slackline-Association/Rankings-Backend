import { DynamicModule, Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../../utils/utils';
import { DDBAthleteRankingsRepository } from './athlete.rankings.repo';

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class DDBAthleteRankingsRepoModule {
  public static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBAthleteRankingsRepository,
      dynamodbService,
    );
    return {
      module: DDBAthleteRankingsRepoModule,
      providers: [repo],
      exports: [repo],
    };
  }
  public static forTest(dynamodbService: IDynamoDBService): ModuleMetadata {
    const repo = repositoryFactory(
      DDBAthleteRankingsRepository,
      dynamodbService,
    );
    return {
      providers: [repo],
      exports: [],
    };
  }
}
