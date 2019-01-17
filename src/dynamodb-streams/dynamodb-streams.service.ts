import { Injectable } from '@nestjs/common';
import { DynamoDBRecord } from 'aws-lambda';
import { logger } from 'shared/logger';
import { AthleteContestRecordService } from './athlete/athlete-contest-record.service';
import { AthleteDetailsRecordService } from './athlete/athlete-details-record.service';

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
  constructor(
    private readonly athleteContestResultService: AthleteContestRecordService,
    private readonly athleteDetailsService: AthleteDetailsRecordService,
  ) {}

  public async processRecords(records: DynamoDBRecord[]) {
    const promises = [];
    for (const record of records) {
      promises.push(
        this.processRecord(record).catch(err => {
          logger.error('Processing Streams Error', {
            data: {
              record: record,
              err: err.message,
            },
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
    if (this.athleteDetailsService.isRecordValidForThisService(record.dynamodb)) {
      await this.athleteDetailsService.processNewRecord(record);
    }
  }
}
