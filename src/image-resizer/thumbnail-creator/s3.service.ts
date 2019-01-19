import { S3 } from 'aws-sdk';

import { Injectable } from '@nestjs/common';
import env_variables from 'shared/env_variables';
import { Utils } from 'shared/utils';

@Injectable()
export class S3Service {
  // private bucket = env_variables.s3_images_bucket;
  constructor(private readonly s3: S3) {}

  public async getObject(key: string, bucket: string) {
    const params: S3.Types.GetObjectRequest = {
      Bucket: bucket,
      Key: key,
    };
    return await this.s3
      .getObject(params)
      .promise()
      .then((data: S3.Types.GetObjectOutput) => data)
      .catch<null>(err => {
        Utils.logError('S3 Get Object', err, params);
        return null;
      });
  }

  public async uploadObject(key: string, bucket: string, body: Buffer) {
    const params: S3.Types.PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      ACL: 'public-read',
      Body: body,
      ContentType: 'image/jpg'
    };
    return await this.s3
      .putObject(params)
      .promise()
      .then(data => data)
      .catch(Utils.logThrowError('S3 Put Object', params));
  }
}
