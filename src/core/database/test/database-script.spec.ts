import { Test } from '@nestjs/testing';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { DynamoDBServices } from 'core/aws/aws.services';
import { AthleteContestRecordService } from 'dynamodb-streams/athlete/athlete-contest-record.service';
import { AthleteRecordsModule } from 'dynamodb-streams/athlete/athlete-records.module';
import { Utils } from 'shared/utils';
import { DatabaseModule } from '../database.module';
import { DatabaseService } from '../database.service';

describe('Database Script', () => {
  let databaseService: DatabaseService;
  let athleteRecordsService: AthleteContestRecordService;

  beforeAll(async () => {
    const module = await Test.createTestingModule(DatabaseModule.forTest(new DynamoDBServices(), undefined)).compile();
    databaseService = module.get(DatabaseService);

    const module2 = await Test.createTestingModule({ imports: [AthleteRecordsModule] }).compile();
    athleteRecordsService = module2.get(AthleteContestRecordService);

    jest.setTimeout(100000);
  });

  describe('fix', () => {
    it('', async () => {
      // const allAthletes = await databaseService.queryAthletes(undefined);
      // for (const athlete of allAthletes.items) {
      //   if (athlete.city === '' || athlete.city === 'unknown') {
      //     const modifiedAthlete = new AthleteDetail({ ...athlete, city: '' });
      //     await databaseService.putAthlete(modifiedAthlete);
      //     console.log('Modified: ', athlete);
      //   }
      // }
    });
  });
});
