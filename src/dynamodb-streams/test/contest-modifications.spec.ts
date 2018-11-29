import { StreamRecord } from 'aws-lambda';
import { DynamoDBServices } from 'core/aws/aws.services';
import { DDBAthleteContestsRepository } from 'core/database/dynamodb/athlete/contests/athlete.contests.repo';
import { handler } from 'dynamodb-streams';
import { createDynamoDBEvent, triggerLambdaHandlerWithEvent } from './lambda-trigger';

describe('DynamoDB Streams', () => {
  let athleteContestRepo: DDBAthleteContestsRepository;

  beforeAll(async () => {
    athleteContestRepo = new DDBAthleteContestsRepository(new DynamoDBServices());
  });

  describe('Contest Modifications', () => {
    it('should pretend new athlete contest result has inserted', async () => {
      const newImage = athleteContestRepo.transformToDynamoDBType({
        athleteId: 'can-sahin',
        contestId: 'test_2018',
        createdAt: 123,
        date: 123,
        discipline: 2,
        place: 1,
        points: 4,
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

      await triggerLambdaHandlerWithEvent(handler, event);
    });
  });
});
