import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DynamoDB } from 'aws-sdk';
import { IDynamoDBService } from 'core/aws/aws.services.interface';

export abstract class DDBRepository {
    protected client: DocumentClient;
    protected db: DynamoDB;

    protected abstract _tableName;

    constructor(dynamodbService: IDynamoDBService) {
        this.client = dynamodbService.DynamoDocumentClient;
        this.db = dynamodbService.DynamoDB;
    }
}
