import { Injectable } from '@nestjs/common';
import { DDBRepository, LocalSecondaryIndexName } from '../../dynamodb.repo';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { logDynamoDBError, logThrowDynamoDBError } from '../../utils/utils';
import {
  AllAttrs,
  DDBDisciplineContestItem,
} from './discipline.contest.interface';
import { LastEvaluatedKey } from '../../interfaces/table.interface';
import { DDBDisciplineContestAttrsTransformers } from './transformers/attributes.transformers';
import { Discipline } from 'shared/enums';
import { DisciplineContestItemTransformer } from './transformers/entity.transformer';

@Injectable()
export class DDBDisciplineContestRepository extends DDBRepository {
  protected _tableName = 'ISA-Rankings';
  constructor(
    dynamodbService: IDynamoDBService,
    private readonly transformers: DDBDisciplineContestAttrsTransformers,
    public readonly entityTransformer: DisciplineContestItemTransformer,
  ) {
    super(dynamodbService);
  }

  public async get(contestId: string, discipline: Discipline, year: number) {
    const params: DocumentClient.GetItemInput = {
      TableName: this._tableName,
      Key: this.transformers.primaryKey(year, discipline, contestId),
    };
    return this.client
      .get(params)
      .promise()
      .then(data => {
        if (data.Item) {
          return this.transformers.transformAttrsToItem(data.Item as AllAttrs);
        }
        return null;
      })
      .catch<null>(err => {
        logDynamoDBError('DDBDisciplineContestRepository get', err, params);
        return null;
      });
  }

  public async put(contest: DDBDisciplineContestItem) {
    const params = {
      TableName: this._tableName,
      Item: this.transformers.transformItemToAttrs(contest),
    };
    return this.client
      .put(params)
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
        PK: this.transformers.itemToAttrsTransformer.PK(),
        SK_GSI: this.transformers.itemToAttrsTransformer.SK_GSI(
          year,
          discipline,
          after.contestId,
        ),
        LSI: this.transformers.itemToAttrsTransformer.LSI(
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
        '#pk': this.transformers.attrName('PK'),
        '#lsi': this.transformers.attrName('LSI'),
      },
      ExpressionAttributeValues: {
        ':pk': this.transformers.itemToAttrsTransformer.PK(),
        ':sortKeyPrefix': this.transformers.itemToAttrsTransformer.LSI(
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
          return this.transformers.transformAttrsToItem(item);
        });
        return items;
      })
      .catch(
        logThrowDynamoDBError('DDBDisciplineContestRepository query', params),
      );
  }
}
