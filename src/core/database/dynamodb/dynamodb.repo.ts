import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';

export const LocalSecondaryIndexName = 'PK-LSI-index';
export const GlobalSecondaryIndexName = 'GSI-GSI_SK-index';

export abstract class DDBRepository {
  protected client: DocumentClient;
  protected db: DynamoDB;

  protected abstract _tableName;

  constructor(dynamodbService: IDynamoDBService) {
    this.client = dynamodbService.DynamoDocumentClient;
    this.db = dynamodbService.DynamoDB;
  }
}
