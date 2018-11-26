import { Callback, Context, DynamoDBRecord, DynamoDBStreamEvent, StreamRecord } from 'aws-lambda';
import { DynamoDBServices } from 'core/aws/aws.services';
import { DDBAthleteContestsRepository } from 'core/database/dynamodb/athlete/contests/athlete.contests.repo';
import { handler } from 'dynamodb-streams';

interface LambdaTrigger<TEvent, TResult> {
  event: TEvent;
  context: Context;
  callback: Callback<TResult>;
}
function context(options, cb): Context {
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

const callback: Callback<void> = (err, result) => {};

function createDynamoDBEvent(
  eventName: DynamoDBRecord['eventName'],
  record: StreamRecord,
) {
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
describe('DynamoDB Streams', () => {
  let athleteContestRepo: DDBAthleteContestsRepository;

  beforeAll(async () => {
    athleteContestRepo = new DDBAthleteContestsRepository(
      new DynamoDBServices(),
    );
  });

  describe('trigger handler', () => {
    it('should pretend new athlete contest result has inserted', async () => {
      const newImage = athleteContestRepo.transformToDynamoDBType({
        athleteId: 'a',
        contestId: '1',
        createdAt: 123,
        date: 123,
        discipline: 0,
        place: 1,
        points: 1,
        year: 123,
      });
      const dynamobRecord: StreamRecord = {
        Keys: {
          PK: newImage.PK,
          SK_GSI: newImage.SK_GSI,
          LSI: newImage.LSI,
          GSI_SK: newImage.GSI_SK,
        },
        NewImage: newImage,
        StreamViewType: 'NEW_AND_OLD_IMAGES',
        SequenceNumber: '111',
        SizeBytes: 26,
      };
      const event = createDynamoDBEvent('INSERT', dynamobRecord);

      await handler(event, context({}, null), callback);
    });
  });
});
