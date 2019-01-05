import { DynamicModule, Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../utils/utils';
import { DDBContestRepository } from './contest.repo';

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class DDBContestRepoModule {
  public static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBContestRepository,
      dynamodbService,
    );
    return {
      module: DDBContestRepoModule,
      providers: [repo],
      exports: [repo],
    };
  }
  public static forTest(dynamodbService: IDynamoDBService): ModuleMetadata {
    const repo = repositoryFactory(
      DDBContestRepository,
      dynamodbService,
    );
    return {
      providers: [repo],
      exports: [],
    };
  }
}
