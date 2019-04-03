import { Test } from '@nestjs/testing';
import { DynamoDBServices } from 'core/aws/aws.services';
import { DatabaseService } from 'core/database/database.service';
import { Utils } from 'shared/utils';
import { CronJobModule } from './cron-job.module';
import { CronJobService } from './cron-job.service';
import { DatabaseModule } from './database.module';

describe('CronJob', () => {
  let cronJobService: CronJobService;
  beforeAll(async () => {
    const m = await Test.createTestingModule({ imports: [CronJobModule] }).compile();
    cronJobService = m.get(CronJobService);
    jest.setTimeout(100000);
  });

  describe('updateAllTopScoreRankings', () => {
    it('', async () => {
      await cronJobService.runCronJobs();
      return true;
    });
  });
});
