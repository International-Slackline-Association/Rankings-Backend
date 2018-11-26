import { DynamicModule, Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../../utils/utils';
import { DDBAthleteContestsRepository } from './athlete.contests.repo';

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class DDBAthleteContestsRepoModule {
  public static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBAthleteContestsRepository,
      dynamodbService,
    );
    return {
      module: DDBAthleteContestsRepoModule,
      providers: [repo],
      exports: [repo],
    };
  }
  public static forTest(dynamodbService: IDynamoDBService): ModuleMetadata {
    const repo = repositoryFactory(
      DDBAthleteContestsRepository,
      dynamodbService,
    );
    return {
      providers: [repo],
      exports: [],
    };
  }
}
