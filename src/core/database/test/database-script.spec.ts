import { Test } from '@nestjs/testing';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { DynamoDBServices } from 'core/aws/aws.services';
import { Utils } from 'shared/utils';
import { DatabaseModule } from '../database.module';
import { DatabaseService } from '../database.service';

describe('Database Script', () => {
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const module = await Test.createTestingModule(DatabaseModule.forTest(new DynamoDBServices(), undefined)).compile();
    databaseService = module.get(DatabaseService);
  });

  describe('fix duplicate athletes', () => {
    it('', async () => {
      // const allAthletes = await databaseService.queryAthletes(undefined);
      // for (const athlete of allAthletes.items) {
      //   if (
      //     athlete.id.includes('_') &&
      //     (athlete.id.includes('1') || athlete.id.includes('2') || athlete.id.includes('3'))
      //   ) {
      //     const originalAthlete = allAthletes.items.find(a => a.email === athlete.email && !a.id.includes('_'));
      //     if (originalAthlete) {
      //       if (athlete.infoUrl && !originalAthlete.infoUrl) {
      //         const modifiedAthlete = new AthleteDetail({ ...originalAthlete, infoUrl: athlete.infoUrl });
      //         await databaseService.putAthlete(modifiedAthlete);
      //       }
      //       await databaseService.deleteAthlete(athlete.id);
      //       console.log('Deleted: ', athlete);
      //     }
      //   }
      // }
    });
  });
});
