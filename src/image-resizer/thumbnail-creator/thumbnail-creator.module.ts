import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { AWSServices } from 'core/aws/aws.services';
import { S3Service } from './s3.service';
import { ThumbnailCreatorService } from './thumbnail-creator.service';

const s3Factory = {
  provide: S3,
  useFactory: () => {
    return new AWSServices().S3;
  },
};

@Module({
  providers: [ThumbnailCreatorService, S3Service, s3Factory],
  exports: [ThumbnailCreatorService],
})
export class ThumbnailCreatorModule {}
