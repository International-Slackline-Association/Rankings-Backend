import { DynamicModule, Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { repositoryFactory } from '../../utils/utils';
import { DDBAthleteDetailsRepository } from './athlete.details.repo';

@Module({
  imports: [],
  providers: [],
  exports: [],
})
export class DDBAthleteDetailsRepoModule {
  public static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
    const repo = repositoryFactory(
      DDBAthleteDetailsRepository,
      dynamodbService,
    );
    return {
      module: DDBAthleteDetailsRepoModule,
      providers: [repo],
      exports: [repo],
    };
  }
  public static forTest(dynamodbService: IDynamoDBService): ModuleMetadata {
    const repo = repositoryFactory(
      DDBAthleteDetailsRepository,
      dynamodbService,
    );
    return {
      providers: [repo],
      exports: [],
    };
  }
}
