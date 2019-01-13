import { Injectable } from '@nestjs/common';
import { AttributeValue, StreamRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { Discipline } from 'shared/enums';
import { DDBRepository, GlobalSecondaryIndexName, LocalSecondaryIndexName } from '../../dynamodb.repo';
import { GSILastEvaluatedKey, LSILastEvaluatedKey } from '../../interfaces/table.interface';
import { logThrowDynamoDBError } from '../../utils/utils';
import { AllAttrs, DDBAthleteContestItem, KeyAttrs } from './athlete.contests.interface';
import { AttrsTransformer } from './transformers/attributes.transformer';
import { EntityTransformer } from './transformers/entity.transformer';

import dynamoDataTypes = require('dynamodb-data-types');
const dynamoDbAttrValues = dynamoDataTypes.AttributeValue;

@Injectable()
export class DDBAthleteContestsRepository extends DDBRepository {
  protected _tableName = 'ISA-Rankings';
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

  public transformToDynamoDBType(item: DDBAthleteContestItem): { [P in keyof KeyAttrs]: AttributeValue } {
    const attr = this.transformer.transformItemToAttrs(item);
    return dynamoDbAttrValues.wrap(attr);
  }

  public async put(contest: DDBAthleteContestItem) {
    const params: DocumentClient.PutItemInput = {
      TableName: this._tableName,
      Item: this.transformer.transformItemToAttrs(contest),
    };
    return this.client
      .put(params)
      .promise()
      .then(data => data)
      .catch(logThrowDynamoDBError('DDBAthleteContestsRepository Put', params));
  }

  public async queryAthleteContestsByDate(
    athleteId: string,
    limit: number,
    year?: number,
    after?: {
      contestId: string;
      discipline: Discipline;
      date: string;
    },
    filter: { disciplines?: Discipline[] } = { disciplines: [] },
  ) {
    const exclusiveStartKey = this.createLSIExclusiveStartKey(athleteId, after);
    const { filterExpression, filterExpAttrNames, filterExpAttrValues } = this.createFilterExpression(filter);

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
        ':pk': this.transformer.itemToAttrsTransformer.PK(athleteId),
        ':sortKeyPrefix': this.transformer.itemToAttrsTransformer.LSI((year || '').toString()),
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
      .catch(logThrowDynamoDBError('DDBAthleteContestsRepository queryAthleteContestsByDate', params));
  }

  public async queryContestAthletes(
    contestId: string,
    discipline: Discipline,
    limit: number,
    after?: { athleteId: string; points: number },
  ) {
    const exclusiveStartKey = this.createGSIExclusiveStartKey(contestId, discipline, after);
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this._tableName,
      IndexName: GlobalSecondaryIndexName,
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: exclusiveStartKey,
      KeyConditionExpression: '#sk_gsi = :sk_gsi',
      ExpressionAttributeNames: {
        '#sk_gsi': this.transformer.attrName('SK_GSI'),
      },
      ExpressionAttributeValues: {
        ':sk_gsi': this.transformer.itemToAttrsTransformer.SK_GSI(discipline, contestId),
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
      .catch(logThrowDynamoDBError('DDBAthleteContestsRepository queryContestAthletes', params));
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

  private extractGSILastEvaluatedKey(lastEvaluatedKey: GSILastEvaluatedKey) {
    let lastKey: any;
    if (lastEvaluatedKey) {
      lastKey = {
        athleteId: this.transformer.attrsToItemTransformer.athleteId(lastEvaluatedKey.PK),
        points: this.transformer.attrsToItemTransformer.points(lastEvaluatedKey.GSI_SK),
      };
    }
    return lastKey;
  }

  private createLSIExclusiveStartKey(
    athleteId: string,
    after?: {
      contestId: string;
      discipline: Discipline;
      date: string;
    },
  ): LSILastEvaluatedKey {
    let startKey: LSILastEvaluatedKey;
    if (after && after.contestId && after.date) {
      startKey = {
        PK: this.transformer.itemToAttrsTransformer.PK(athleteId),
        SK_GSI: this.transformer.itemToAttrsTransformer.SK_GSI(after.discipline, after.contestId),
        LSI: this.transformer.itemToAttrsTransformer.LSI(after.date),
      };
    }
    return startKey;
  }

  private createGSIExclusiveStartKey(
    contestId: string,
    discipline: number,
    after?: { athleteId: string; points: number },
  ) {
    let startKey: GSILastEvaluatedKey;
    if (after && after.athleteId && after.points) {
      startKey = {
        PK: this.transformer.itemToAttrsTransformer.PK(after.athleteId),
        SK_GSI: this.transformer.itemToAttrsTransformer.SK_GSI(discipline, contestId),
        GSI_SK: this.transformer.itemToAttrsTransformer.GSI_SK(after.points),
      };
    }
    return startKey;
  }

  private createFilterExpression(filter: { disciplines?: Discipline[] }) {
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
    return {
      filterExpression: filterExpression || undefined,
      filterExpAttrNames,
      filterExpAttrValues,
    };
  }
}
