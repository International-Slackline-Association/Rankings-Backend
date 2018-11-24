import { Injectable } from '@nestjs/common';
import { DDBRepository, LocalSecondaryIndexName } from '../dynamodb.repo';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { logDynamoDBError, logThrowDynamoDBError } from '../utils/utils';
import {
  AllAttrs,
  DDBDisciplineContestItem,
} from './discipline.contest.interface';
import { LastEvaluatedKey } from '../interfaces/table.interface';
import { Discipline } from 'shared/enums';
import { EntityTransformer } from './transformers/entity.transformer';
import { AttrsTransformer } from './transformers/attributes.transformer';

@Injectable()
export class DDBDisciplineContestRepository extends DDBRepository {
  protected readonly _tableName = 'ISA-Rankings';
  private readonly transformer = new AttrsTransformer();
  public readonly entityTransformer = new EntityTransformer();

  constructor(dynamodbService: IDynamoDBService) {
    super(dynamodbService);
  }

  public async get(contestId: string, discipline: Discipline, year: number) {
    const params: DocumentClient.GetItemInput = {
      TableName: this._tableName,
      Key: this.transformer.primaryKey(year, discipline, contestId),
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
        logDynamoDBError('DDBDisciplineContestRepository get', err, params);
        return null;
      });
  }

  public async put(contest: DDBDisciplineContestItem) {
    const params: DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        [this._tableName]: [
          {
            PutRequest: {
              Item: this.transformer.transformItemToAttrs(contest),
            },
          },
          {
            PutRequest: {
              Item: this.transformer.byDate.transformItemToAttrs(contest),
            },
          },
        ],
      },
    };
    return this.client
      .batchWrite(params)
      .promise()
      .then(data => data)
      .catch(
        logThrowDynamoDBError('DDBDisciplineContestRepository Put', params),
      );
  }

  public async queryDisciplineContestsByDate(
    year: number,
    discipline: Discipline,
    limit: number,
    after?: {
      contestId: string;
      date: number;
    },
  ) {
    let startKey: LastEvaluatedKey;
    if (after && after.contestId && after.date) {
      startKey = {
        PK: this.transformer.itemToAttrsTransformer.PK(),
        SK_GSI: this.transformer.itemToAttrsTransformer.SK_GSI(
          year,
          discipline,
          after.contestId,
        ),
        LSI: this.transformer.itemToAttrsTransformer.LSI(
          year,
          discipline,
          after.date,
        ),
      };
    }
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this._tableName,
      IndexName: LocalSecondaryIndexName,
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: startKey,
      KeyConditionExpression:
        '#pk = :pk and begins_with(#lsi, :sortKeyPrefix) ',
      ExpressionAttributeNames: {
        '#pk': this.transformer.attrName('PK'),
        '#lsi': this.transformer.attrName('LSI'),
      },
      ExpressionAttributeValues: {
        ':pk': this.transformer.itemToAttrsTransformer.PK(),
        ':sortKeyPrefix': this.transformer.itemToAttrsTransformer.LSI(
          year,
          discipline,
          undefined,
        ),
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
      .catch(
        logThrowDynamoDBError('DDBDisciplineContestRepository query', params),
      );
  }
}
