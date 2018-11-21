import { Module, DynamicModule } from '@nestjs/common';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../../utils/utils';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { DDBDisciplineContestRepository } from './discipline.contest.repo';
import { DDBDisciplineContestAttrsTransformers } from './transformers/attributes.transformers';
import { DisciplineContestItemTransformer } from './transformers/entity.transformer';

@Module({
  imports: [],
  providers: [
    DDBDisciplineContestAttrsTransformers,
    DisciplineContestItemTransformer,
  ],
  exports: [DDBDisciplineContestAttrsTransformers],
})
export class DDBDisciplineContestRepoModule {
  static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBDisciplineContestRepository,
      [DDBDisciplineContestAttrsTransformers, DisciplineContestItemTransformer],
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
