import { Module, DynamicModule } from '@nestjs/common';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../../utils/utils';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { DDBAthleteContestsRepository } from './athlete.contests.repo';
import { DDBAthleteContestsAttrsTransformers } from './athlete.contests.transformers';

@Module({
  imports: [],
  providers: [DDBAthleteContestsAttrsTransformers],
  exports: [DDBAthleteContestsAttrsTransformers],
})
export class DDBAthleteContestsRepoModule {
  static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBAthleteContestsRepository,
      DDBAthleteContestsAttrsTransformers,
      dynamodbService,
    );
    return {
      module: DDBAthleteContestsRepoModule,
      providers: [repo],
      exports: [repo],
    };
  }
  static forTest(dynamodbService: IDynamoDBService): ModuleMetadata {
    const repo = repositoryFactory(
      DDBAthleteContestsRepository,
      DDBAthleteContestsAttrsTransformers,
      dynamodbService,
    );
    return {
      providers: [repo, DDBAthleteContestsAttrsTransformers],
      exports: [],
    };
  }
}
