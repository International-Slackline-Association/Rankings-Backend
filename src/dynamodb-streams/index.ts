import { NestFactory } from '@nestjs/core';
import { DynamoDBRecord, DynamoDBStreamHandler } from 'aws-lambda';
import * as dotenv from 'dotenv-override';
import { logger, waitForLogger } from 'shared/logger';
import { DynamoDBStreamsModule } from './dynamodb-streams.module';
import { DynamoDBStreamsService } from './dynamodb-streams.service';

dotenv.config({ path: '../../.env', override: true });
import 'shared';

async function bootstrap(records: DynamoDBRecord[]) {
  const app = await NestFactory.createApplicationContext(DynamoDBStreamsModule, { logger: false });
  const service = app.get(DynamoDBStreamsService);
  await service.processRecords(records);
}

export const handler: DynamoDBStreamHandler = async (event, context) => {
  logger.debug('DynamoDB Event', { data: event });
  // Socket connections (redis) keeps waiting lamba functions. Dont want that
  // context.callbackWaitsForEmptyEventLoop = false;

  await bootstrap(event.Records);

  if (process.env.IS_OFFLINE === 'true') {
    clearEventLoop();
  }
  await waitForLogger();
};

const clearEventLoop = () => {
  // terminateConnections();
};
