import { Injectable } from '@nestjs/common';

import {
  CloudWatch as AWSCloudWatch,
  CloudWatchLogs as AWSCloudWatchLogs,
  DynamoDB as AWSDynamoDB,
  S3 as AWSS3,
} from 'aws-sdk';
import { IAWSServices, IDynamoDBService } from './aws.services.interface';

@Injectable()
export class AWSServices implements IAWSServices {
  constructor() {}

  public CloudWatch = new AWSCloudWatch();

  public CloudWatchLogs = new AWSCloudWatchLogs();

  public DynamoDB = new AWSDynamoDB();

  public DynamoDocumentClient = new AWSDynamoDB.DocumentClient();

  public S3 = new AWSS3();
}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class DynamoDBServices implements IDynamoDBService {
  constructor() {}

  public DynamoDB = new AWSDynamoDB();

  public DynamoDocumentClient = new AWSDynamoDB.DocumentClient();
}
