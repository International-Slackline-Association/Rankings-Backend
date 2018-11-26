import { Injectable } from '@nestjs/common';
import { AttributeValue, StreamRecord } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { Discipline } from 'shared/enums';
import { DDBRepository, LocalSecondaryIndexName } from '../../dynamodb.repo';
import { LastEvaluatedKey } from '../../interfaces/table.interface';
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

  public transformToDynamoDBType(item: DDBAthleteContestItem): {[P in keyof KeyAttrs]: AttributeValue} {
    const attr = this.transformer.transformItemToAttrs(item);
    return dynamoDbAttrValues.wrap(attr);
  }

  public async put(contest: DDBAthleteContestItem) {
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
      .catch(logThrowDynamoDBError('DDBAthleteContestsRepository Put', params));
  }

  public async queryAthleteContestsByDate(
    athleteId: string,
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
        PK: this.transformer.itemToAttrsTransformer.PK(athleteId),
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
        ':pk': this.transformer.itemToAttrsTransformer.PK(athleteId),
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
        logThrowDynamoDBError('DDBAthleteContestsRepository query', params),
      );
  }
}
