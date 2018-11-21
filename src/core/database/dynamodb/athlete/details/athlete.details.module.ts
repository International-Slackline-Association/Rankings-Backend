import { Module, DynamicModule } from '@nestjs/common';
import { DDBAthleteDetailsRepository } from './athlete.details.repo';
import { DDBAthleteDetailsAttrsTransformers } from './transformers/attributes.transformer';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../../utils/utils';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { AthleteDetailItemTransformer } from './transformers/entity.transformer';

@Module({
  imports: [],
  providers: [DDBAthleteDetailsAttrsTransformers, AthleteDetailItemTransformer],
  exports: [],
})
export class DDBAthleteDetailsRepoModule {
  static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBAthleteDetailsRepository,
      [DDBAthleteDetailsAttrsTransformers, AthleteDetailItemTransformer],
      dynamodbService,
    );
    return {
      module: DDBAthleteDetailsRepoModule,
      providers: [repo],
      exports: [repo],
    };
  }
  static forTest(dynamodbService: IDynamoDBService): ModuleMetadata {
    const repo = repositoryFactory(
      DDBAthleteDetailsRepository,
      [DDBAthleteDetailsAttrsTransformers, AthleteDetailItemTransformer],
      dynamodbService,
    );
    return {
      providers: [repo, DDBAthleteDetailsAttrsTransformers],
      exports: [],
    };
  }
}
