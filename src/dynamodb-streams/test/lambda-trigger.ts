import {
  Callback,
  Context,
  DynamoDBRecord,
  DynamoDBStreamEvent,
  DynamoDBStreamHandler,
  StreamRecord,
} from 'aws-lambda';

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

export function createDynamoDBEvent(eventName: DynamoDBRecord['eventName'], record: StreamRecord) {
  const dynamoEvent: DynamoDBStreamEvent = {
    Records: [
      {
        eventID: '1',
        eventVersion: '1.0',
        dynamodb: record,
        awsRegion: '',
        eventName: eventName,
        eventSourceARN: '',
        eventSource: 'aws:dynamodb',
      },
    ],
  };
  return dynamoEvent;
}

export async function triggerLambdaHandlerWithEvent(
  handler: DynamoDBStreamHandler,
  event: DynamoDBStreamEvent,
  context?,
  callback = defaultCallback,
) {
  if (!context) {
    context = createLambdaContext({}, null);
  }
  return handler(event, context, callback);
}
