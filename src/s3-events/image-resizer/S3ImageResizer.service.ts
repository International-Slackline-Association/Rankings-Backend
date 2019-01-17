import { Injectable } from '@nestjs/common';

import { AWSServices } from 'core/aws/aws.services';
import { S3Service } from './s3.service';

@Injectable()
export class S3ImageResizerService {
  constructor(private readonly s3Service: S3Service) {}

  public async resize(s3Key: string) {
    this.s3Service.getObject(s3Key);
  }
}
