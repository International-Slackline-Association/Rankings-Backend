import { Injectable } from '@nestjs/common';
import { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { DatabaseService } from 'core/database/database.service';
import { DDBAthleteContestsRepository } from 'core/database/dynamodb/athlete/contests/athlete.contests.repo';
import { isRecordOfTypeOfKeys } from 'dynamodb-streams/utils';

@Injectable()
export class AthleteContestResultService {
  constructor(
    private readonly db: DatabaseService,
    private readonly athleteContestsRepo: DDBAthleteContestsRepository,
  ) {}

  public isRecordValidForThisService(record: StreamRecord): boolean {
    const prefixes = this.athleteContestsRepo.transformer.prefixes;
    return isRecordOfTypeOfKeys(record.Keys, prefixes);
  }

  public async processNewRecord(record: DynamoDBRecord) {
    const item = this.athleteContestsRepo.transformFromDynamoDBType(record.dynamodb.NewImage);
    console.log(item);
  }
}
