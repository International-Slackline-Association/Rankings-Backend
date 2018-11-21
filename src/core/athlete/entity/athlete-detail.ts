import { Gender, AgeCategory } from 'shared/enums';

export class AthleteDetail {
  id: string;
  name: string;
  surname: string;
  birth: number;
  gender: Gender;
  country: string;
  continent: string;
  ageCategory: AgeCategory;
  profilePictureUrl: string;
  createdAt?: number;
}
