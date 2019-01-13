import { Test } from '@nestjs/testing';
import { DynamoDBServices } from 'core/aws/aws.services';
import { DatabaseModule } from './database.module';
import { DatabaseService } from './database.service';

import { Discipline } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';

describe('Database Service', () => {
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const module = await Test.createTestingModule(DatabaseModule.forTest(new DynamoDBServices(), undefined)).compile();
    databaseService = module.get(DatabaseService);
  });

  describe('query contest by date', () => {
    it('', async () => {
      // const x = DisciplineUtility.getParents(Discipline.Speedline__HighLongWaterline);
      // console.log(x);
      // const y = DisciplineUtility.getAllChildren(Discipline.Overall);
      // console.log(y);
      // console.log('');

      // const x = await databaseService.queryAthleteContestsByDate('alpha-test', 1, undefined, undefined, {
      //   disciplines: [],
      // });
      // console.log('Results:', x);
      // console.log();
    });
  });
});
