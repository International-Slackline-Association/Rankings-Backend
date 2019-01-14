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
        athleteId: 'alpha-test',
        contestId: 'alpha_2015',
        createdAt: 123,
        date: '2015-10-25',
        discipline: 8,
        place: 1,
        points: 1000,
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
