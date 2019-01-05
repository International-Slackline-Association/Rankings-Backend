import { Test } from '@nestjs/testing';
import { DynamoDBServices } from 'core/aws/aws.services';
import { AgeCategory, Gender } from 'shared/enums';
import { DDBAthleteDetailItem } from './athlete.details.interface';
import { DDBAthleteDetailsRepoModule } from './athlete.details.module';
import { DDBAthleteDetailsRepository } from './athlete.details.repo';

describe('AthleteDetails', () => {
  let repo: DDBAthleteDetailsRepository;

  const athlete: DDBAthleteDetailItem = {
    athleteId: '1',
    birthdate: '2017-10-25',
    country: 'Switzerland',
    createdAt: 1234,
    gender: Gender.Men,
    name: 'name1',
    normalizedName: 'name1',
    surname: 'surname2',
    profileUrl: '',
    city: 'city',
    email: 'email',
    infoUrl: 'infoUrl',
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
