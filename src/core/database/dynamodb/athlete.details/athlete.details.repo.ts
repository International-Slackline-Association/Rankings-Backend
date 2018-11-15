import { Injectable } from '@nestjs/common';
import { DDBRepository } from '../dynamodb.repo';
import { DDBAthleteDetailsRepositoryTransformers } from './athlete.details.transformers';
import { DDBAthleteDetailItem, AllAttrs } from './athlete.details.interface';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';

@Injectable()
export class DDBAthleteDetailsRepository extends DDBRepository {
    protected _tableName = 'ISA-Rankings';
    constructor(
        dynamodbService: IDynamoDBService,
        private readonly transformers: DDBAthleteDetailsRepositoryTransformers,
    ) {
        super(dynamodbService);
    }
    public async test() {
        return this.transformers.primaryKey('a').PK;
    }
    public async get(athleteId: string): Promise<DDBAthleteDetailItem> {
        const params: DocumentClient.GetItemInput = {
            TableName: this._tableName,
            Key: this.transformers.primaryKey(athleteId),
        };
        return this.client
            .get(params)
            .promise()
            .then(data => {
                return this.transformers.transformAttrsToItem(
                    data.Item as AllAttrs,
                );
            })
            .catch(err => {
                return null;
            });
    }
}
