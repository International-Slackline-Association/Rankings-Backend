import { StreamRecord } from 'aws-lambda';
import { DynamoDBServices } from 'core/aws/aws.services';
import { DDBAthleteContestsRepository } from 'core/database/dynamodb/athlete/contests/athlete.contests.repo';
import { DDBContestRepository } from 'core/database/dynamodb/contests/contest.repo';
import { handler } from 'dynamodb-streams';
import { createDynamoDBEvent, triggerLambdaHandlerWithEvent } from './lambda-trigger';

describe('DynamoDB Streams', () => {
  let athleteContestRepo: DDBAthleteContestsRepository;
  let contestRepo: DDBContestRepository;

  beforeAll(async () => {
    athleteContestRepo = new DDBAthleteContestsRepository(new DynamoDBServices());
    contestRepo = new DDBContestRepository(new DynamoDBServices());
  });

  describe('Contest Modifications', () => {
    it('', async () => {
      // const newImage = contestRepo.transformToDynamoDBType({
      //   category: undefined,
      //   gender: undefined,
      //   city: undefined,
      //   contestId: 'bern-city-slack-9_2018',
      //   country: undefined,
      //   createdAt: undefined,
      //   date: '2018-08-25',
      //   discipline: 7,
      //   infoUrl: undefined,
      //   name: undefined,
      //   normalizedName: undefined,
      //   prize: undefined,
      //   profileUrl: undefined,
      //   thumbnailUrl: undefined,
      // });
      // const dynamobRecord: StreamRecord = {
      //   Keys: {
      //     PK: newImage.PK,
      //     SK_GSI: newImage.SK_GSI,
      //     LSI: newImage.LSI,
      //     GSI_SK: newImage.GSI_SK,
      //   },
      //   NewImage: newImage,
      //   StreamViewType: 'NEW_AND_OLD_IMAGES',
      //   SequenceNumber: '111',
      //   SizeBytes: 26,
      // };
      // const event = createDynamoDBEvent('MODIFY', dynamobRecord);

      // await triggerLambdaHandlerWithEvent(handler, event);
    });
  });
});
