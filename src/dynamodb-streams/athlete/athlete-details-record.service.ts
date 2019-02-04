import { Injectable } from '@nestjs/common';
import { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { DatabaseService } from 'core/database/database.service';
import { DDBAthleteDetailsRepository } from 'core/database/dynamodb/athlete/details/athlete.details.repo';
import { isRecordOfTypeOfKeys } from 'dynamodb-streams/utils';

@Injectable()
export class AthleteDetailsRecordService {
  constructor(
    private readonly db: DatabaseService,
    private readonly athleteDetailsRepo: DDBAthleteDetailsRepository,
  ) {}

  public isRecordValidForThisService(record: StreamRecord): boolean {
    const prefixes = this.athleteDetailsRepo.transformer.prefixes;
    return isRecordOfTypeOfKeys(record.Keys, prefixes);
  }

  public async processNewRecord(record: DynamoDBRecord) {
    if (record.eventName === 'MODIFY' || record.eventName === 'REMOVE') {
      const oldItem = this.athleteDetailsRepo.transformFromDynamoDBType(record.dynamodb.OldImage);
      await this.db.clearAthleteDetailsCache(oldItem.id);
    }
  }
}
