import { NestFactory } from '@nestjs/core';
import { S3EventRecord, S3Handler } from 'aws-lambda';

import 'shared';

import { logger, waitForLogger } from 'shared/logger';
import { S3EventsModule } from './S3Events.module';
import { S3EventsService } from './S3Events.service';

async function bootstrap(records: S3EventRecord[]) {
  const app = await NestFactory.createApplicationContext(S3EventsModule);
  const service = app.get(S3EventsService);
  await service.processRecords(records);
}

export const handler: S3Handler = async (event, context, callback) => {
  logger.debug('S3 Event', { data: event });

  context.callbackWaitsForEmptyEventLoop = false;

  await bootstrap(event.Records);

  await waitForLogger();
};
