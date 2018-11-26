import { Injectable } from '@nestjs/common';
// tslint:disable-next-line:max-line-length
import { CloudWatch as AWSCloudWatch, CloudWatchLogs as AWSCloudWatchLogs, DynamoDB as AWSDynamoDB, S3 as AWSS3 } from 'aws-sdk';
import { IAWSServices, IDynamoDBService } from './aws.services.interface';

/**
 * No credentials given. Lambda function (or local serverless profile) will detect credentials automatically
 */
@Injectable()
export class AWSServices implements IAWSServices {
  constructor() {}

  public CloudWatch = new AWSCloudWatch();

  public CloudWatchLogs = new AWSCloudWatchLogs();

  public DynamoDB = new AWSDynamoDB();

  public DynamoDocumentClient = new AWSDynamoDB.DocumentClient();

  public S3 = new AWSS3();
}

/**
 * No credentials given. Lambda function (or local serverless profile) will detect credentials automatically
 */
// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class DynamoDBServices implements IDynamoDBService {
  public DynamoDB = new AWSDynamoDB();

  public DynamoDocumentClient = new AWSDynamoDB.DocumentClient();

  constructor() {}
}
