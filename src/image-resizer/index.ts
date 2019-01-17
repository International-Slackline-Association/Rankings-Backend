import { S3Handler } from 'aws-lambda';
import { logger, waitForLogger } from 'shared/logger';

export const handler: S3Handler = async (event, context, callback) => {
  logger.debug('S3 Event', { data: event });
  if (process.env.IS_OFFLINE === 'true') {
    clearEventLoop();
  }
  await waitForLogger();
};

const clearEventLoop = () => {
  // terminateConnections();
};
