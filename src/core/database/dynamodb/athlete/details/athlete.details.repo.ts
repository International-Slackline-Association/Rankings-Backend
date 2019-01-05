import { Injectable } from '@nestjs/common';
import { AttributeValue, StreamRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { DDBRepository } from '../../dynamodb.repo';
import { logDynamoDBError, logThrowDynamoDBError } from '../../utils/utils';
import { AllAttrs, DDBAthleteDetailItem, KeyAttrs } from './athlete.details.interface';
import { AttrsTransformer } from './transformers/attributes.transformer';
import { EntityTransformer } from './transformers/entity.transformer';

import dynamoDataTypes = require('dynamodb-data-types');
const dynamoDbAttrValues = dynamoDataTypes.AttributeValue;
@Injectable()
export class DDBAthleteDetailsRepository extends DDBRepository {
  protected readonly _tableName = 'ISA-Rankings';
  public readonly transformer = new AttrsTransformer();
  public readonly entityTransformer = new EntityTransformer();

  constructor(dynamodbService: IDynamoDBService) {
    super(dynamodbService);
  }

  public transformFromDynamoDBType(image: StreamRecord['NewImage']) {
    const attributes = dynamoDbAttrValues.unwrap(image) as AllAttrs;
    const item = this.transformer.transformAttrsToItem(attributes);
    return this.entityTransformer.fromDBItem(item);
  }

  public transformToDynamoDBType(item: DDBAthleteDetailItem): { [P in keyof KeyAttrs]: AttributeValue } {
    const attr = this.transformer.transformItemToAttrs(item);
    return dynamoDbAttrValues.wrap(attr);
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
      .catch(logThrowDynamoDBError('DDBAthleteDetailsRepository batchGet', params));
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

  public async updateUrl(athleteId: string, url: string) {
    const params: DocumentClient.UpdateItemInput = {
      TableName: this._tableName,
      Key: this.transformer.primaryKey(athleteId),
      UpdateExpression: 'SET #profileUrl = :url',
      ConditionExpression: 'attribute_exists(#pk)',
      ExpressionAttributeNames: {
        '#pk': this.transformer.attrName('PK'),
        '#profileUrl': this.transformer.attrName('profileUrl'),
      },
      ExpressionAttributeValues: {
        ':url': url
      },
      ReturnValues: 'UPDATED_NEW',
    };
    return this.client
      .update(params)
      .promise()
      .then(data => {
        return data.Attributes[this.transformer.attrName('profileUrl')] as string;
      })
      .catch(logThrowDynamoDBError('DDBAthleteDetailsRepository updateUrl', params));
  }
}
