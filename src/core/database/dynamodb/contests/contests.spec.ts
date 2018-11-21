import { Test } from '@nestjs/testing';
import { DynamoDBServices } from 'core/aws/aws.services';
import { DDBContestsRepository } from './contests.repo';
import { DDBContestsRepoModule } from './contests.module';
import { DDBContestItem } from './contests.interface';
import { Discipline, ContestCategory, PrizeUnit } from 'shared/enums';

describe('Contests', () => {
  let repo: DDBContestsRepository;

  const contest: DDBContestItem = {
    city: 'Zurich',
    contestId: 'c2',
    country: 'Switzerland',
    createdAt: 123,
    date: 125,
    disciplines: [Discipline.Blind, Discipline.Contact],
    categories: [ContestCategory.Challenge],
    name: 'contest2',
    normalizedName: 'contest2',
    totalprize: 200,
    prizeUnit: PrizeUnit.Euro,
    profilePictureUrl: '',
    year: 2018,
  };
  beforeAll(async () => {
    const module = await Test.createTestingModule(
      DDBContestsRepoModule.forTest(new DynamoDBServices()),
    ).compile();
    repo = module.get(DDBContestsRepository);
  });

  describe('put contest', () => {
    it('should put item', async () => {
      // const x = await repo.queryContestsByDate(2018);
      // console.log(x);
    });
  });
});
