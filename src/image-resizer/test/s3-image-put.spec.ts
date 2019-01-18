import { S3EventRecord } from 'aws-lambda';
import { handler } from 'image-resizer';
import { createS3Event, triggerLambdaHandlerWithEvent } from './lambda-trigger';

describe('S3 Events', () => {
  beforeAll(async () => {});

  describe('Athlete Image Upload', () => {
    it('', async () => {
      const s3record: S3EventRecord = {
        eventVersion: undefined,
        eventSource: undefined,
        awsRegion: undefined,
        eventTime: undefined,
        eventName: undefined,
        userIdentity: undefined,
        requestParameters: undefined,
        responseElements: undefined,
        s3: {
          s3SchemaVersion: undefined,
          configurationId: undefined,
          bucket: {
            name: 'isa.rankings.eu-west-1.images',
            ownerIdentity: undefined,
            arn: undefined,
          },
          object: {
            key: 'public/athlete/test.png',
            size: undefined,
            eTag: undefined,
            versionId: undefined,
            sequencer: undefined,
          },
        },
      };
      const event = createS3Event(s3record);

      await triggerLambdaHandlerWithEvent(handler, event);
    });
  });
});
