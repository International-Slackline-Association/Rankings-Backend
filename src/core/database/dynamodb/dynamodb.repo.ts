import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DynamoDB } from 'aws-sdk';
import { IAWSServices } from 'core/aws/aws.services.interface';

export abstract class DDBRepository {
    protected client: DocumentClient;
    protected db: DynamoDB;

    protected abstract _tableName;

    constructor(awsServices: IAWSServices) {
        this.client = awsServices.DynamoDocumentClient;
        this.db = awsServices.DynamoDB;
    }
}
