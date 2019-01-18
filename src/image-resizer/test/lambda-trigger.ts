import { Callback, Context, S3Event, S3EventRecord, S3Handler } from 'aws-lambda';

export interface LambdaTriggerEvent<TEvent, TResult> {
  event: TEvent;
  context: Context;
  callback: Callback<TResult>;
}

function createLambdaContext(options, cb): Context {
  return {
    succeed: result => {
      if (result === undefined) {
        return cb(null);
      } else {
        if (typeof result !== 'string') {
          return cb(JSON.stringify(result));
        } else {
          return cb(result);
        }
      }
    },
    fail: error => {
      if (error === undefined) {
        return cb(null);
      } else {
        return cb(error);
      }
    },
    done: function(err, result) {
      if (err) {
        return this.fail(err);
      } else {
        return this.succeed(result);
      }
    },
    getRemainingTimeInMillis: function() {
      if (typeof this.timeInMillis !== 'number') {
        return 0;
      } else {
        return this.timeInMillis;
      }
    },
    callbackWaitsForEmptyEventLoop: options.callbackWaitsForEmptyEventLoop || '',
    functionName: options.functionName || '',
    functionVersion: options.functionVersion || '',
    invokedFunctionArn: options.invokedFunctionArn || '',
    memoryLimitInMB: options.memoryLimitInMB || '',
    awsRequestId: options.awsRequestId || '',
    logGroupName: options.logGroupName || '',
    logStreamName: options.logStreamName || '',
    identity: options.identity || {},
    clientContext: options.clientContext || {},
  };
}

const defaultCallback: Callback<void> = (err, result) => {};

export function createS3Event(record: S3EventRecord) {
  const s3Event: S3Event = {
    Records: [record],
  };
  return s3Event;
}

export async function triggerLambdaHandlerWithEvent(
  handler: S3Handler,
  event: S3Event,
  context?,
  callback = defaultCallback,
) {
  if (!context) {
    context = createLambdaContext({}, null);
  }
  return handler(event, context, callback);
}
