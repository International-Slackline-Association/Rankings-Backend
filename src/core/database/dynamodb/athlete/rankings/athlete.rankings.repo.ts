import { Injectable } from '@nestjs/common';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { DDBRepository } from '../../dynamodb.repo';
import { logThrowDynamoDBError } from '../../utils/utils';
import { DDBAthleteRankingsItem } from './athlete.rankings.interface';
import { AttrsTransformer } from './transformers/attributes.transformers';

@Injectable()
export class DDBAthleteRankingsRepository extends DDBRepository {
  protected readonly _tableName = 'ISA-Rankings';
  private readonly transformer = new AttrsTransformer();

  constructor(dynamodbService: IDynamoDBService) {
    super(dynamodbService);
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
}
