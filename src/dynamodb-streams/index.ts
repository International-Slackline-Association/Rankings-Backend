import { NestFactory } from '@nestjs/core';
import { DynamoDBRecord, DynamoDBStreamHandler } from 'aws-lambda';

import 'shared';

import env_variables from 'shared/env_variables';
import { logger, waitForLogger } from 'shared/logger';
import { DynamoDBStreamsModule } from './dynamodb-streams.module';
import { DynamoDBStreamsService } from './dynamodb-streams.service';

async function bootstrap(records: DynamoDBRecord[]) {
  const app = await NestFactory.createApplicationContext(DynamoDBStreamsModule, {
    logger: env_variables.isDev ? undefined : false,
  });
  const service = app.get(DynamoDBStreamsService);
  await service.processRecords(records);
}

export const handler: DynamoDBStreamHandler = async (event, context) => {
  logger.debug('DynamoDB Event', { data: event });
  // Socket connections (redis) keeps waiting lamba functions. Dont want that
  context.callbackWaitsForEmptyEventLoop = false;

  await bootstrap(event.Records);

  if (process.env.IS_OFFLINE === 'true') {
    clearEventLoop();
  }
  await waitForLogger();
};

const clearEventLoop = () => {
  // terminateConnections();
};
