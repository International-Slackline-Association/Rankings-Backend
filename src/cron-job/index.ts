import { NestFactory } from '@nestjs/core';
import { S3EventRecord, S3Handler } from 'aws-lambda';

import 'shared';

import env_variables from 'shared/env_variables';
import { logger, waitForLogger } from 'shared/logger';
import { CronJobModule } from './cron-job.module';
import { CronJobService } from './cron-job.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CronJobModule, {
    logger: env_variables.isDev ? undefined : false,
  });
  const service = app.get(CronJobService);
  return service
    .runCronJobs()
    .then(d => d)
    .catch(err =>
      logger.error('Cron Jobs Error', {
        data: {
          err: err.message,
        },
      }),
    );
}

export const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await bootstrap();

  await waitForLogger();
};
