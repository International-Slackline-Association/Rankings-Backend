import { Module, DynamicModule } from '@nestjs/common';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../../utils/utils';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { DDBAthleteContestsRepository } from './athlete.contests.repo';

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class DDBAthleteContestsRepoModule {
  static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBAthleteContestsRepository,
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
      dynamodbService,
    );
    return {
      providers: [repo],
      exports: [],
    };
  }
}
