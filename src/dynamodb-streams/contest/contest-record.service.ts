import { Injectable } from '@nestjs/common';
import { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { DatabaseService } from 'core/database/database.service';
import { DDBContestRepository } from 'core/database/dynamodb/contests/contest.repo';
import { isRecordOfTypeOfKeys } from 'dynamodb-streams/utils';

@Injectable()
export class ContestRecordService {
  constructor(private readonly db: DatabaseService, private readonly contestRepo: DDBContestRepository) {}

  public isRecordValidForThisService(record: StreamRecord): boolean {
    const prefixes = this.contestRepo.transformer.prefixes;
    const x = isRecordOfTypeOfKeys(record.Keys, prefixes);
    return x;
  }

  public async processNewRecord(record: DynamoDBRecord) {
    if (record.eventName === 'MODIFY' || record.eventName === 'REMOVE') {
      const oldItem = this.contestRepo.transformFromDynamoDBType(record.dynamodb.OldImage);
      await this.db.clearContestCache(oldItem.id, oldItem.discipline);
    }
  }
}
