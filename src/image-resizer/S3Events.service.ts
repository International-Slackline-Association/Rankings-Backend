import { Injectable } from '@nestjs/common';
import { S3EventRecord } from 'aws-lambda';
import { logger } from 'shared/logger';
import { ThumbnailCreatorService } from './thumbnail-creator/thumbnail-creator.service';

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
  constructor(private readonly thumbnailCreator: ThumbnailCreatorService) {}

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
    await this.thumbnailCreator.createThumbnail(record.s3.object.key, record.s3.bucket.name);
  }
}
