import { Injectable } from '@nestjs/common';
import { DDBRepository } from '../dynamodb.repo';
import { DDBAthleteDetailsRepositoryTransformers } from './athlete.details.transformers';
import { AWSServices } from 'core/aws/aws.services';
import { DDBAthleteDetailItem, AllAttrs } from './athlete.details.interface';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

@Injectable()
export class DDBAthleteDetailsRepository extends DDBRepository {
    protected _tableName = 'ISA-Rankings';
    constructor(
        awsServices: AWSServices,
        private readonly transformers: DDBAthleteDetailsRepositoryTransformers,
    ) {
        super(awsServices);
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
