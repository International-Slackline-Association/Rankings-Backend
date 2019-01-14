import { Injectable } from '@nestjs/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { Discipline } from 'shared/enums';
import { IdGenerator } from 'shared/generators/id.generator';
import { DDBRepository, LocalSecondaryIndexName } from '../dynamodb.repo';
import { LSILastEvaluatedKey } from '../interfaces/table.interface';
import { logDynamoDBError, logThrowDynamoDBError } from '../utils/utils';
import { AllAttrs, DDBContestItem } from './contest.interface';
import { AttrsTransformer } from './transformers/attributes.transformer';
import { EntityTransformer } from './transformers/entity.transformer';

@Injectable()
export class DDBContestRepository extends DDBRepository {
  protected readonly _tableName = 'ISA-Rankings';
  private readonly transformer = new AttrsTransformer();
  public readonly entityTransformer = new EntityTransformer();

  constructor(dynamodbService: IDynamoDBService) {
    super(dynamodbService);
  }

  public async get(contestId: string, discipline: Discipline) {
    const year = IdGenerator.stripYearFromContestId(contestId);
    const params: DocumentClient.GetItemInput = {
      TableName: this._tableName,
      Key: this.transformer.primaryKey(discipline, contestId),
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
        logDynamoDBError('DDBContestRepository get', err, params);
        return null;
      });
  }

  public async put(contest: DDBContestItem) {
    const params: DocumentClient.PutItemInput = {
      TableName: this._tableName,
      Item: this.transformer.transformItemToAttrs(contest),
    };
    return this.client
      .put(params)
      .promise()
      .then(data => data)
      .catch(logThrowDynamoDBError('DDBContestRepository Put', params));
  }

  public async updateProfileUrl(contestId: string, discipline: Discipline, url: string) {
    const params: DocumentClient.UpdateItemInput = {
      TableName: this._tableName,
      Key: this.transformer.primaryKey(discipline, contestId),
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
      .catch(logThrowDynamoDBError('DDBContestRepository updateUrl', params));
  }

  public async queryContestsByDate(
    limit: number,
    opts: {
      year?: number;
      after?: {
        contestId: string;
        discipline: Discipline;
        date: string;
      };
      filter?: { disciplines?: Discipline[]; name?: string; id?: string };
    } = {},
  ) {
    const exclusiveStartKey = this.createLSIExclusiveStartKey(opts.after);
    const { filterExpression, filterExpAttrNames, filterExpAttrValues } = this.createFilterExpression(opts.filter);

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this._tableName,
      IndexName: LocalSecondaryIndexName,
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: exclusiveStartKey,
      KeyConditionExpression: '#pk = :pk and begins_with(#lsi, :sortKeyPrefix) ',
      FilterExpression: filterExpression,
      ExpressionAttributeNames: {
        '#pk': this.transformer.attrName('PK'),
        '#lsi': this.transformer.attrName('LSI'),
        ...filterExpAttrNames,
      },
      ExpressionAttributeValues: {
        ':pk': this.transformer.itemToAttrsTransformer.PK(),
        ':sortKeyPrefix': this.transformer.itemToAttrsTransformer.LSI((opts.year || '').toString()),
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
        return { items: items, lastKey: this.extractLSILastEvaluatedKey(data.LastEvaluatedKey as LSILastEvaluatedKey) };
      })
      .catch(logThrowDynamoDBError('DDBContestRepository query', params));
  }

  private extractLSILastEvaluatedKey(lastEvaluatedKey: LSILastEvaluatedKey) {
    let lastKey: any;
    if (lastEvaluatedKey) {
      lastKey = {
        contestId: this.transformer.attrsToItemTransformer.contestId(lastEvaluatedKey.SK_GSI),
        discipline: this.transformer.attrsToItemTransformer.discipline(lastEvaluatedKey.SK_GSI),
        date: this.transformer.attrsToItemTransformer.date(lastEvaluatedKey.LSI),
      };
    }
    return lastKey;
  }

  private createLSIExclusiveStartKey(after?: {
    contestId: string;
    discipline: Discipline;
    date: string;
  }): LSILastEvaluatedKey {
    let startKey: LSILastEvaluatedKey;
    if (after && after.contestId && after.date && after.discipline) {
      startKey = {
        PK: this.transformer.itemToAttrsTransformer.PK(),
        SK_GSI: this.transformer.itemToAttrsTransformer.SK_GSI(after.discipline, after.contestId),
        LSI: this.transformer.itemToAttrsTransformer.LSI(after.date),
      };
    }
    return startKey;
  }

  private createFilterExpression(filter?: { disciplines?: Discipline[]; name?: string; id?: string }) {
    let filterExpression = '';
    const filterExpAttrNames = {};
    const filterExpAttrValues = {};

    if (!filter) {
      return { filterExpression: undefined, filterExpAttrNames, filterExpAttrValues };
    }
    if (filter.disciplines) {
      for (const discipline of filter.disciplines) {
        filterExpression =
          (filterExpression ? filterExpression + ' or ' : '') + `contains(#sk_gsi, :discipline_${discipline})`;
        filterExpAttrNames['#sk_gsi'] = this.transformer.attrName('SK_GSI');
        filterExpAttrValues[`:discipline_${discipline}`] = `:${discipline}:`;
      }
    }
    if (filter.name) {
      filterExpression =
        (filterExpression ? filterExpression + ' and ' : '') + `contains(#normalizedName, :queryString)`;
      filterExpAttrNames['#normalizedName'] = this.transformer.attrName('normalizedName');
      filterExpAttrValues[':queryString'] = filter.name;
    }
    if (filter.id) {
      filterExpression = (filterExpression ? filterExpression + ' and ' : '') + `contains(#sk_gsi, :id)`;
      filterExpAttrNames['#sk_gsi'] = this.transformer.attrName('SK_GSI');
      filterExpAttrValues[':id'] = filter.id;
    }
    return {
      filterExpression: filterExpression || undefined,
      filterExpAttrNames,
      filterExpAttrValues,
    };
  }
}
