import { S3Handler } from 'aws-lambda';
import { logger, waitForLogger } from 'shared/logger';

export const handler: S3Handler = (event, context, callback) => {
  logger.debug('S3 Event', { event });
  if (process.env.IS_OFFLINE === 'true') {
    clearEventLoop();
  }
  end(null, callback);
};

const clearEventLoop = () => {
  // terminateConnections();
};

const end = async (err, callback) => {
  waitForLogger()
    .then(() => {
      callback(err);
    })
    .catch(error => {
      callback(err);
    });
};
