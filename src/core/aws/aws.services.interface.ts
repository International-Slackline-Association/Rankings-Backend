import {
  CloudWatch as AWSCloudWatch,
  CloudWatchLogs as AWSCloudWatchLogs,
  DynamoDB as AWSDynamoDB,
  S3 as AWSS3,
} from 'aws-sdk';

export interface IAWSServices extends IDynamoDBService {
  CloudWatch: AWSCloudWatch;
  CloudWatchLogs: AWSCloudWatchLogs;
  S3: AWSS3;
}

export interface IDynamoDBService {
  DynamoDB: AWSDynamoDB;
  DynamoDocumentClient: AWSDynamoDB.DocumentClient;
}
