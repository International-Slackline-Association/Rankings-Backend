import { Module, DynamicModule } from '@nestjs/common';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../utils/utils';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { DDBContestsRepository } from './contests.repo';
import { DDBContestsAttrsTransformers } from './transformers/attributes.transformers';
import { ContestInfoItemTransformer } from './transformers/contest.entity.transformer';

@Module({
  imports: [],
  providers: [DDBContestsAttrsTransformers, ContestInfoItemTransformer],
  exports: [DDBContestsAttrsTransformers, ContestInfoItemTransformer],
})
export class DDBContestsRepoModule {
  static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBContestsRepository,
      DDBContestsAttrsTransformers,
      dynamodbService,
    );
    return {
      module: DDBContestsRepoModule,
      providers: [repo],
      exports: [repo],
    };
  }
  static forTest(dynamodbService: IDynamoDBService): ModuleMetadata {
    const repo = repositoryFactory(
      DDBContestsRepository,
      DDBContestsAttrsTransformers,
      dynamodbService,
    );
    return {
      providers: [repo, DDBContestsAttrsTransformers],
      exports: [],
    };
  }
}
