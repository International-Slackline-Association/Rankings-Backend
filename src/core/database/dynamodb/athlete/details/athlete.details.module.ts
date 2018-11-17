import { Module, DynamicModule } from '@nestjs/common';
import { DDBAthleteDetailsRepository } from './athlete.details.repo';
import { DDBAthleteDetailsAttrsTransformers } from './athlete.details.transformers';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../../utils/utils';
import { ModuleMetadata } from '@nestjs/common/interfaces';

@Module({
  imports: [],
  providers: [DDBAthleteDetailsAttrsTransformers],
  exports: [DDBAthleteDetailsAttrsTransformers],
})
export class DDBAthleteDetailsRepoModule {
  static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBAthleteDetailsRepository,
      DDBAthleteDetailsAttrsTransformers,
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
      DDBAthleteDetailsAttrsTransformers,
      dynamodbService,
    );
    return {
      providers: [repo, DDBAthleteDetailsAttrsTransformers],
      exports: [],
    };
  }
}
