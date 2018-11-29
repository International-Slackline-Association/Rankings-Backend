import { Injectable } from '@nestjs/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import * as moment from 'moment';
import { AgeCategory, Discipline, Gender } from 'shared/enums';
import { DDBRepository } from '../../dynamodb.repo';
import { logDynamoDBError, logThrowDynamoDBError } from '../../utils/utils';
import { AllAttrs, DDBAthleteRankingsItem, DDBAthleteRankingsItemPrimaryKey } from './athlete.rankings.interface';
import { AttrsTransformer } from './transformers/attributes.transformers';
import { EntityTransformer } from './transformers/entity.transformer';

@Injectable()
export class DDBAthleteRankingsRepository extends DDBRepository {
  protected readonly _tableName = 'ISA-Rankings';
  private readonly transformer = new AttrsTransformer();
  public readonly entityTransformer = new EntityTransformer();

  constructor(dynamodbService: IDynamoDBService) {
    super(dynamodbService);
  }

  public async get(pk: DDBAthleteRankingsItemPrimaryKey) {
    const params: DocumentClient.GetItemInput = {
      TableName: this._tableName,
      Key: this.transformer.primaryKey(pk.athleteId, pk.year, pk.discipline, pk.gender, pk.ageCategory),
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
        logDynamoDBError('DDBAthleteRankingsRepository get', err, params);
        return null;
      });
  }

  public async put(item: DDBAthleteRankingsItem) {
    const params = {
      TableName: this._tableName,
      Item: this.transformer.transformItemToAttrs(item),
    };
    return this.client
      .put(params)
      .promise()
      .then(data => data)
      .catch(logThrowDynamoDBError('DDBAthleteRankingsRepository Put', params));
  }

  public async updatePoints(pk: DDBAthleteRankingsItemPrimaryKey, points: number) {
    const params: DocumentClient.UpdateItemInput = {
      TableName: this._tableName,
      Key: this.transformer.primaryKey(pk.athleteId, pk.year, pk.discipline, pk.gender, pk.ageCategory),
      UpdateExpression: 'SET #GSI_SK = :points, #lastUpdatedAt = :unixTime',
      ConditionExpression: 'attribute_exists(#pk)',
      ExpressionAttributeNames: {
        '#pk': this.transformer.attrName('PK'),
        '#GSI_SK': this.transformer.attrName('GSI_SK'),
        '#lastUpdatedAt': this.transformer.attrName('lastUpdatedAt'),
      },
      ExpressionAttributeValues: {
        ':unixTime': moment().unix(),
        ':points': points.toString(),
      },
      ReturnValues: 'UPDATED_NEW',
    };
    return this.client
      .update(params)
      .promise()
      .then(data => {
        return data.Attributes[this.transformer.attrName('GSI_SK')] as number;
      })
      .catch(logThrowDynamoDBError('DDBAthleteRankingsRepository addPoints', params));
  }
}
