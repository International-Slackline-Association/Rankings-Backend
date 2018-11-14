import {
    CloudWatch as AWSCloudWatch,
    CloudWatchLogs as AWSCloudWatchLogs,
    DynamoDB as AWSDynamoDB,
    S3 as AWSS3,
} from 'aws-sdk';

export interface IAWSServices {
    CloudWatch: AWSCloudWatch;
    CloudWatchLogs: AWSCloudWatchLogs;
    DynamoDB: AWSDynamoDB;
    DynamoDocumentClient: AWSDynamoDB.DocumentClient;
    S3: AWSS3;
}
