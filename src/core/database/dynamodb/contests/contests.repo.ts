import { Injectable } from '@nestjs/common';
import { DDBRepository, LocalSecondaryIndexName } from '../dynamodb.repo';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { logDynamoDBError, logThrowDynamoDBError } from '../utils/utils';
import { DDBContestsAttrsTransformers } from './contests.transformers';
import {
  AllAttrs,
  DDBContestItem,
} from './contests.interface';
import { LastEvaluatedKey } from '../interfaces/table.interface';

@Injectable()
export class DDBContestsRepository extends DDBRepository {
  protected _tableName = 'ISA-Rankings';
  constructor(
    dynamodbService: IDynamoDBService,
    private readonly transformers: DDBContestsAttrsTransformers,
  ) {
    super(dynamodbService);
  }

  public async get(contestId: string, year: number) {
    const params: DocumentClient.GetItemInput = {
      TableName: this._tableName,
      Key: this.transformers.primaryKey(contestId, year),
    };
    return this.client
      .get(params)
      .promise()
      .then(data => {
        return this.transformers.transformAttrsToItem(data.Item as AllAttrs);
      })
      .catch<null>(err => {
        logDynamoDBError('DDBContestsRepository get', err, params);
        return null;
      });
  }

  public async batchGet(contestIds: string[], year: number) {
    const params: DocumentClient.BatchGetItemInput = {
      RequestItems: {
        [this._tableName]: {
          Keys: contestIds.map(id => {
            return this.transformers.primaryKey(id, year);
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
      .catch(logThrowDynamoDBError('DDBContestsRepository batchGet', params));
  }

  public async put(contest: DDBContestItem) {
    const params = {
      TableName: this._tableName,
      Item: this.transformers.transformItemToAttrs(contest, this.client),
    };
    return this.client
      .put(params)
      .promise()
      .then(data => data)
      .catch(logThrowDynamoDBError('DDBContestsRepository Put', params));
  }

  public async queryContestsByDate(
    year: number,
    after?: {
      contestId: string;
      date: number;
    },
  ) {
    let startKey: LastEvaluatedKey;
    if (after && after.contestId && after.date) {
      startKey = {
        PK: this.transformers.itemToAttrsTransformer.PK(),
        SK_GSI: this.transformers.itemToAttrsTransformer.SK_GSI(
          year,
          after.contestId,
        ),
        LSI: this.transformers.itemToAttrsTransformer.LSI(year, after.date),
      };
    }
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this._tableName,
      IndexName: LocalSecondaryIndexName,
      Limit: 1,
      ScanIndexForward: false,
      ExclusiveStartKey: startKey,
      KeyConditionExpression:
        '#pk = :pk and begins_with(#lsi, :sortKeyPrefix) ',
      ExpressionAttributeNames: {
        '#pk': this.transformers.attrName('PK'),
        '#lsi': this.transformers.attrName('LSI'),
      },
      ExpressionAttributeValues: {
        ':pk': this.transformers.itemToAttrsTransformer.PK(),
        ':sortKeyPrefix': this.transformers.itemToAttrsTransformer.LSI(
          year,
          undefined,
        ),
      },
    };
    return this.client
      .query(params)
      .promise()
      .then(data => {
        console.log(data.LastEvaluatedKey);
        const items = data.Items.map((item: AllAttrs) => {
          return this.transformers.transformAttrsToItem(item);
        });
        return items;
      }).catch(logThrowDynamoDBError('DDBContestsRepository query', params));
    }
}
