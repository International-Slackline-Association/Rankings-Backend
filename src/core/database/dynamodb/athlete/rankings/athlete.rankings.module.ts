import { Module, DynamicModule } from '@nestjs/common';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../../utils/utils';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { DDBAthleteRankingsRepository } from './athlete.rankings.repo';
import { DDBAthleteRankingsAttrsTransformers } from './transformers/attributes.transformers';

@Module({
  imports: [],
  providers: [DDBAthleteRankingsAttrsTransformers],
  exports: [DDBAthleteRankingsAttrsTransformers],
})
export class DDBAthleteRankingsRepoModule {
  static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBAthleteRankingsRepository,
      DDBAthleteRankingsAttrsTransformers,
      dynamodbService,
    );
    return {
      module: DDBAthleteRankingsRepoModule,
      providers: [repo],
      exports: [repo],
    };
  }
  static forTest(dynamodbService: IDynamoDBService): ModuleMetadata {
    const repo = repositoryFactory(
      DDBAthleteRankingsRepository,
      DDBAthleteRankingsAttrsTransformers,
      dynamodbService,
    );
    return {
      providers: [repo, DDBAthleteRankingsAttrsTransformers],
      exports: [],
    };
  }
}
