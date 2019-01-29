import { Test } from '@nestjs/testing';
import { DynamoDBServices } from 'core/aws/aws.services';
import { DatabaseModule } from '../database.module';
import { DatabaseService } from '../database.service';

describe('Database Script', () => {
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const module = await Test.createTestingModule(DatabaseModule.forTest(new DynamoDBServices(), undefined)).compile();
    databaseService = module.get(DatabaseService);
  });

  describe('fix athlete details', () => {
    it('', async () => {
      // re-write missing fields to db

      // const allAthletes = await databaseService.queryAthletes(200);
      // for (const athlete of allAthletes.items) {
      //   await databaseService.putAthlete(athlete);
      //   console.log('athlete: ', athlete.id);
      // }
    });
  });
});
