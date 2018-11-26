import { Injectable } from '@nestjs/common';
import { DynamoDBRecord } from 'aws-lambda';
import { logger } from 'shared/logger';
import { AthleteContestResultService } from './contest/contest-result.service';

function reflect(promise: Promise<any>) {
  return promise.then(
    v => {
      return { v: v, status: 'resolved' };
    },
    e => {
      return { e: e, status: 'rejected' };
    },
  );
}

@Injectable()
export class DynamoDBStreamsService {
  constructor(private readonly athleteContestResultService: AthleteContestResultService) {}

  public async processRecords(records: DynamoDBRecord[]) {
    const promises = [];
    for (const record of records) {
      promises.push(
        this.processRecord(record).catch(err => {
          logger.error('Processing Streams Error', {
            record: record,
            err: err,
          });
        }),
      );
    }
    await Promise.all(promises.map(reflect));
  }

  private async processRecord(record: DynamoDBRecord) {
    if (this.athleteContestResultService.isRecordValidForThisService(record.dynamodb)) {
      await this.athleteContestResultService.processNewRecord(record);
    }
  }
}
