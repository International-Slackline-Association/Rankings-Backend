import { Injectable } from '@nestjs/common';
import { DDBRepository, LocalSecondaryIndexName } from '../../dynamodb.repo';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { logThrowDynamoDBError } from '../../utils/utils';
import { DDBAthleteRankingsAttrsTransformers } from './transformers/attributes.transformers';
import { DDBAthleteRankingsItem } from './athlete.rankings.interface';

@Injectable()
export class DDBAthleteRankingsRepository extends DDBRepository {
  protected _tableName = 'ISA-Rankings';
  constructor(
    dynamodbService: IDynamoDBService,
    private readonly transformers: DDBAthleteRankingsAttrsTransformers,
  ) {
    super(dynamodbService);
  }

  public async put(contest: DDBAthleteRankingsItem) {
    const params = {
      TableName: this._tableName,
      Item: this.transformers.transformItemToAttrs(contest),
    };
    return this.client
      .put(params)
      .promise()
      .then(data => data)
      .catch(logThrowDynamoDBError('DDBAthleteRankingsRepository Put', params));
  }
}
