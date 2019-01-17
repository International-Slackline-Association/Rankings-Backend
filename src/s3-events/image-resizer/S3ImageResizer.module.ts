import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { AWSServices } from 'core/aws/aws.services';
import { S3Service } from './s3.service';
import { S3ImageResizerService } from './S3ImageResizer.service';

const s3Factory = {
  provide: S3,
  useFactory: () => {
    return new AWSServices().S3;
  },
};

@Module({
  providers: [S3ImageResizerService, S3Service, s3Factory],
  exports: [S3ImageResizerService],
})
export class S3ImageResizerModule {}
