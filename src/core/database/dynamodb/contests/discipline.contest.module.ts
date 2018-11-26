import { DynamicModule, Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../utils/utils';
import { DDBDisciplineContestRepository } from './discipline.contest.repo';

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class DDBDisciplineContestRepoModule {
  public static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBDisciplineContestRepository,
      dynamodbService,
    );
    return {
      module: DDBDisciplineContestRepoModule,
      providers: [repo],
      exports: [repo],
    };
  }
  public static forTest(dynamodbService: IDynamoDBService): ModuleMetadata {
    const repo = repositoryFactory(
      DDBDisciplineContestRepository,
      dynamodbService,
    );
    return {
      providers: [repo],
      exports: [],
    };
  }
}
