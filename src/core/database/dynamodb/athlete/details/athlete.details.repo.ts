import { Injectable } from '@nestjs/common';
import { DDBRepository } from '../../dynamodb.repo';
import { DDBAthleteDetailsAttrsTransformers } from './transformers/attributes.transformer';
import { DDBAthleteDetailItem, AllAttrs } from './athlete.details.interface';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { logDynamoDBError, logThrowDynamoDBError } from '../../utils/utils';

@Injectable()
export class DDBAthleteDetailsRepository extends DDBRepository {
  protected _tableName = 'ISA-Rankings';
  constructor(
    dynamodbService: IDynamoDBService,
    private readonly transformers: DDBAthleteDetailsAttrsTransformers,
  ) {
    super(dynamodbService);
  }
  public async get(athleteId: string) {
    const params: DocumentClient.GetItemInput = {
      TableName: this._tableName,
      Key: this.transformers.primaryKey(athleteId),
    };
    return this.client
      .get(params)
      .promise()
      .then(data => {
        return this.transformers.transformAttrsToItem(data.Item as AllAttrs);
      })
      .catch<null>(err => {
        logDynamoDBError('DDBAthleteDetailsRepository get', err, params);
        return null;
      });
  }
  public async batchGet(athleteIds: string[]) {
    const params: DocumentClient.BatchGetItemInput = {
      RequestItems: {
        [this._tableName]: {
          Keys: athleteIds.map(id => {
            return this.transformers.primaryKey(id);
          }),
        },
      },
    };
    return this.client
      .batchGet(params)
      .promise()
      .then(data => {
        return data.Responses[this._tableName].map((item: AllAttrs) => {
          return this.transformers.transformAttrsToItem(item);
        });
      })
      .catch(logThrowDynamoDBError('DDBAthleteDetailsRepository batchGet', params));
  }
  public async put(athlete: DDBAthleteDetailItem) {
    const params = {
      TableName: this._tableName,
      Item: this.transformers.transformItemToAttrs(athlete),
    };
    return this.client
      .put(params)
      .promise()
      .then(data => data)
      .catch(logThrowDynamoDBError('DDBAthleteDetailsRepository Put', params));
  }
}
