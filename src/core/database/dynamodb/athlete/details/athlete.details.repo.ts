import { Injectable } from '@nestjs/common';
import { AttributeValue, StreamRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { DDBRepository, GlobalSecondaryIndexName } from '../../dynamodb.repo';
import { logDynamoDBError, logThrowDynamoDBError } from '../../utils/utils';
import { AllAttrs, DDBAthleteDetailItem, KeyAttrs } from './athlete.details.interface';
import { AttrsTransformer } from './transformers/attributes.transformer';
import { EntityTransformer } from './transformers/entity.transformer';

import dynamoDataTypes = require('dynamodb-data-types');
import { GSILastEvaluatedKey } from '../../interfaces/table.interface';
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

  public async updateProfileUrl(athleteId: string, url: string) {
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
        ':url': url,
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

  public async queryAthletesByName(name: string, limit: number) {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this._tableName,
      IndexName: GlobalSecondaryIndexName,
      Limit: limit,
      KeyConditionExpression: '#sk_gsi = :sk_gsi and begins_with(#gsi_sk, :value) ',
      ExpressionAttributeNames: {
        '#sk_gsi': this.transformer.attrName('SK_GSI'),
        '#gsi_sk': this.transformer.attrName('GSI_SK'),
      },
      ExpressionAttributeValues: {
        ':sk_gsi': this.transformer.itemToAttrsTransformer.SK_GSI(),
        ':value': this.transformer.itemToAttrsTransformer.GSI_SK(name),
      },
    };
    return this.client
      .query(params)
      .promise()
      .then(data => {
        const items = data.Items.map((item: AllAttrs) => {
          return this.transformer.transformAttrsToItem(item);
        });
        return items;
      })
      .catch(logThrowDynamoDBError('DDBAthleteDetailsRepository queryAthletesByName', params));
  }

  public async queryAthletes(
    limit: number,
    opts: {
      after?: { athleteId: string; name: string };
      filter?: { fullName?: string };
    } = {},
  ) {
    const exclusiveStartKey = this.createGSIExclusiveStartKey(opts.after);

    const { filterExpression, filterExpAttrNames, filterExpAttrValues } = this.createFilterExpression(opts.filter);

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this._tableName,
      IndexName: GlobalSecondaryIndexName,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
      KeyConditionExpression: '#sk_gsi = :sk_gsi',
      FilterExpression: filterExpression,
      ExpressionAttributeNames: {
        '#sk_gsi': this.transformer.attrName('SK_GSI'),
        ...filterExpAttrNames,
      },
      ExpressionAttributeValues: {
        ':sk_gsi': this.transformer.itemToAttrsTransformer.SK_GSI(),
        ...filterExpAttrValues,
      },
    };
    return this.client
      .query(params)
      .promise()
      .then(data => {
        const items = data.Items.map((item: AllAttrs) => {
          return this.transformer.transformAttrsToItem(item);
        });
        return { items: items, lastKey: this.extractGSILastEvaluatedKey(data.LastEvaluatedKey as GSILastEvaluatedKey) };
      })
      .catch(logThrowDynamoDBError('DDBAthleteDetailsRepository queryAthletes', params));
  }

  private extractGSILastEvaluatedKey(lastEvaluatedKey: GSILastEvaluatedKey) {
    let lastKey: any;
    if (lastEvaluatedKey) {
      lastKey = {
        athleteId: this.transformer.attrsToItemTransformer.athleteId(lastEvaluatedKey.PK),
        name: this.transformer.attrsToItemTransformer.normalizedName(lastEvaluatedKey.GSI_SK),
      };
    }
    return lastKey;
  }

  private createGSIExclusiveStartKey(after?: { athleteId: string; name: string }) {
    let startKey: GSILastEvaluatedKey;
    if (after && after.athleteId && after.name) {
      startKey = {
        PK: this.transformer.itemToAttrsTransformer.PK(after.athleteId),
        SK_GSI: this.transformer.itemToAttrsTransformer.SK_GSI(),
        GSI_SK: this.transformer.itemToAttrsTransformer.GSI_SK(after.name),
      };
    }
    return startKey;
  }

  private createFilterExpression(filter?: { fullName?: string }) {
    let filterExpression = '';
    const filterExpAttrNames = {};
    const filterExpAttrValues = {};

    if (!filter) {
      return { filterExpression: undefined, filterExpAttrNames, filterExpAttrValues };
    }
    if (filter.fullName) {
      filterExpression =
        (filterExpression ? `(${filterExpression}) and ` : '') + `contains(#normalizedFullName, :fullName)`;
      filterExpAttrNames['#normalizedFullName'] = this.transformer.attrName('normalizedFullname');
      filterExpAttrValues[':fullName'] = filter.fullName;
    }
    return {
      filterExpression: filterExpression || undefined,
      filterExpAttrNames,
      filterExpAttrValues,
    };
  }
}
