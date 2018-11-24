import { Injectable } from '@nestjs/common';
import { DDBRepository, LocalSecondaryIndexName } from '../../dynamodb.repo';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { logThrowDynamoDBError } from '../../utils/utils';
import { AttrsTransformer } from './transformers/attributes.transformers';
import { DDBAthleteRankingsItem } from './athlete.rankings.interface';

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
