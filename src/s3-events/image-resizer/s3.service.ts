import { S3 } from 'aws-sdk';

import { Injectable } from '@nestjs/common';
import env_variables from 'shared/env_variables';

@Injectable()
export class S3Service {
  private bucket = env_variables.s3_images_bucket;
  constructor(private readonly s3: S3) {}

  public async getObject(key: string) {
    // console.log(this.s3.apiVersions);
  }
}
