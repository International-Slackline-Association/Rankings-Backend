import { Module } from '@nestjs/common';
import { DDBAthleteDetailsRepository } from './athlete.details.repo';
import { DDBAthleteDetailsRepositoryTransformers } from './athlete.details.transformers';
import { AWSModule } from 'core/aws/aws.module';

@Module({
    imports: [AWSModule],
    providers: [DDBAthleteDetailsRepositoryTransformers, DDBAthleteDetailsRepository],
    exports: [DDBAthleteDetailsRepository],
})
export class DDBAthleteDetailsRepoModule {}
