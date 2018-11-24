import { Injectable } from '@nestjs/common';
import { DDBRepository } from '../../dynamodb.repo';
import { AttrsTransformer } from './transformers/attributes.transformer';
import { DDBAthleteDetailItem, AllAttrs } from './athlete.details.interface';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { logDynamoDBError, logThrowDynamoDBError } from '../../utils/utils';
import { EntityTransformer } from './transformers/entity.transformer';

@Injectable()
export class DDBAthleteDetailsRepository extends DDBRepository {
  protected readonly _tableName = 'ISA-Rankings';
  private readonly transformer = new AttrsTransformer();
  public readonly entityTransformer = new EntityTransformer();

  constructor(
    dynamodbService: IDynamoDBService,
  ) {
    super(dynamodbService);
  }

  public async isExists(athleteId: string) {
    const params: DocumentClient.GetItemInput = {
      TableName: this._tableName,
      Key: this.transformer.primaryKey(athleteId),
      ProjectionExpression: this.transformer.attrName('PK'),
    };
    return this.client
      .get(params)
      .promise()
      .then(data => {
        if (data.Item) {
          return true;
        }
        return false;
      })
      .catch(err => {
        logDynamoDBError('DDBAthleteDetailsRepository isExists', err, params);
        return false;
      });
  }

  public async get(athleteId: string) {
    const params: DocumentClient.GetItemInput = {
      TableName: this._tableName,
      Key: this.transformer.primaryKey(athleteId),
    };
    return this.client
      .get(params)
      .promise()
      .then(data => {
        if (data.Item) {
          return this.transformer.transformAttrsToItem(data.Item as AllAttrs);
        }
        return null;
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
            return this.transformer.primaryKey(id);
          }),
        },
      },
    };
    return this.client
      .batchGet(params)
      .promise()
      .then(data => {
        return data.Responses[this._tableName].map((item: AllAttrs) => {
          return this.transformer.transformAttrsToItem(item);
        });
      })
      .catch(
        logThrowDynamoDBError('DDBAthleteDetailsRepository batchGet', params),
      );
  }
  public async put(athlete: DDBAthleteDetailItem) {
    const params = {
      TableName: this._tableName,
      Item: this.transformer.transformItemToAttrs(athlete),
    };
    return this.client
      .put(params)
      .promise()
      .then(data => data)
      .catch(logThrowDynamoDBError('DDBAthleteDetailsRepository Put', params));
  }
}
