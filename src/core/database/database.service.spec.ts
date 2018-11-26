import { Test } from '@nestjs/testing';
import { DynamoDBServices } from 'core/aws/aws.services';
import { DatabaseModule } from './database.module';
import { DatabaseService } from './database.service';

import latinize = require('latinize');

describe('Database Service', () => {
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const module = await Test.createTestingModule(
      DatabaseModule.forTest(new DynamoDBServices(), undefined),
    ).compile();
    databaseService = module.get(DatabaseService);
  });

  describe('get contest info', () => {
    it('should get item', async () => {
      // const s = 'æåÇaan İşç';
      // const latin = latinize(s);
      // console.log(latin);
      // const x = await databaseService.getContestInfo('testcontest_1970', 1970);
      // logger.debug('a', {...x});
    });
  });
});
