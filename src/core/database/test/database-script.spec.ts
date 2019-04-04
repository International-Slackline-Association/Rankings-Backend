import { Test } from '@nestjs/testing';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { AthleteContestResult } from 'core/athlete/entity/contest-result';
import { DynamoDBServices } from 'core/aws/aws.services';
import { Contest } from 'core/contest/entity/contest';
import { AthleteContestRecordService } from 'dynamodb-streams/athlete/athlete-contest-record.service';
import { AthleteRecordsModule } from 'dynamodb-streams/athlete/athlete-records.module';
import { IdGenerator } from 'shared/generators/id.generator';
import { Utils } from 'shared/utils';
import { DatabaseModule } from '../database.module';
import { DatabaseService } from '../database.service';
import { ContestGender } from 'shared/enums';

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
      //     let counter = 0;
      //     const contests = await databaseService.queryContestsByDate(undefined);
      //     for (const contest of contests.items) {
      //       const newId = IdGenerator.generateContestId();
      //       const newContest = new Contest({ ...contest, id: newId });
      //       const results = await databaseService.queryContestResults(contest.id, contest.discipline, undefined);
      //       console.log(`Contest: ${counter++} , ${contest.id}`);
      //       for (const result of results.items) {
      //         const newResult = new AthleteContestResult({ ...result, contestId: newId });
      //         await databaseService.putContestResult(newResult);
      // tslint:disable-next-line:max-line-length
      //         await databaseService.deleteContestResult(result.athleteId, result.contestId, result.contestDiscipline);
      //       }
      //       await databaseService.putContest(newContest);
      //       await databaseService.deleteContest(contest.id, contest.discipline);
      //     }
    });
  });

  describe('fix', () => {
    it('', async () => {
      // let counter = 0;
      // // const allAthletes = await databaseService.queryAthletes(undefined);
      // const athlete = await this.databaseService.getAthleteDetails('');
      // if (!athlete) {
      //   return 'Athlete Not Found';
      // }
      // // for (const athlete of allAthletes.items) {
      // const newId = IdGenerator.generateAthleteId();
      // const modifiedAthlete = new AthleteDetail({ ...athlete, id: newId });
      // const results = await databaseService.queryAthleteContestsByDate(athlete.id, undefined);
      // console.log(`Athlete: ${counter++} , ${athlete.id}`);
      // for (const result of results.items) {
      //   const newResult = new AthleteContestResult({ ...result, athleteId: newId });
      //   await databaseService.putContestResult(newResult);
      //   await databaseService.deleteContestResult(result.athleteId, result.contestId, result.contestDiscipline);
      // }
      // await databaseService.putAthlete(modifiedAthlete);
      // await databaseService.deleteAthleteRankings(athlete.id);
      // await databaseService.deleteAthlete(athlete.id);
      // // }
    });
  });
});
