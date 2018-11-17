import { Module, DynamicModule } from '@nestjs/common';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../../utils/utils';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { DDBDisciplineContestRepository } from './discipline.contest.repo';
import { DDBDisciplineContestAttrsTransformers } from './discipline.contest.transformers';

@Module({
  imports: [],
  providers: [DDBDisciplineContestAttrsTransformers],
  exports: [DDBDisciplineContestAttrsTransformers],
})
export class DDBDisciplineContestRepoModule {
  static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBDisciplineContestRepository,
      DDBDisciplineContestAttrsTransformers,
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
      DDBDisciplineContestAttrsTransformers,
      dynamodbService,
    );
    return {
      providers: [repo, DDBDisciplineContestAttrsTransformers],
      exports: [],
    };
  }
}
