import { Test } from '@nestjs/testing';
import { DynamoDBServices } from 'core/aws/aws.services';
import { DDBAthleteDetailsRepoModule } from './athlete.details.module';
import { DDBAthleteDetailsRepository } from './athlete.details.repo';
import { DDBAthleteDetailItem } from './athlete.details.interface';
import { Gender, AgeCategory } from 'shared/enums';

describe('AthleteDetails', () => {
  let repo: DDBAthleteDetailsRepository;

  const athlete: DDBAthleteDetailItem = {
    athleteId: '1',
    ageCategory: AgeCategory.Youth,
    birthEpoch: 123,
    continent: 'Europe',
    country: 'Switzerland',
    createdAt: 1234,
    gender: Gender.Men,
    name: 'name1',
    normalizedName: 'name1',
    surname: 'surname2',
    profilePictureUrl: '',
  };
  beforeAll(async () => {
    const module = await Test.createTestingModule(
      DDBAthleteDetailsRepoModule.forTest(new DynamoDBServices()),
    ).compile();
    repo = module.get(DDBAthleteDetailsRepository);
  });

  describe('put athlete', () => {
    it('should put item', async () => {
      // const x = await repo.put(athlete);
      // console.log(x);
    });
  });
});
