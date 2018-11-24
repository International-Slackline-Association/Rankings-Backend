import { Module, DynamicModule } from '@nestjs/common';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../utils/utils';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { DDBDisciplineContestRepository } from './discipline.contest.repo';

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class DDBDisciplineContestRepoModule {
  static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
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
  static forTest(dynamodbService: IDynamoDBService): ModuleMetadata {
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
