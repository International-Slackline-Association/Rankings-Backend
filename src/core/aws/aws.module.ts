import { Module } from '@nestjs/common';
import { AWSServices } from './aws.services';

@Module({
    providers: [AWSServices],
    exports: [AWSServices],
})
export class AWSModule {}
