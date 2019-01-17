import { Injectable } from '@nestjs/common';
import { S3EventRecord } from 'aws-lambda';
import { logger } from 'shared/logger';
import { S3ImageResizerService } from './image-resizer/S3ImageResizer.service';

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
export class S3EventsService {
  constructor(private readonly s3ImageResizer: S3ImageResizerService) {}

  public async processRecords(records: S3EventRecord[]) {
    const promises = [];
    for (const record of records) {
      promises.push(
        this.processRecord(record).catch(err => {
          logger.error('Processing S3 Record Error', {
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

  private async processRecord(record: S3EventRecord) {
    await this.s3ImageResizer.resize(record.s3.object.key);
  }
}
