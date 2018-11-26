import { AgeCategory, Gender } from 'shared/enums';

export class AthleteDetail {
  public id: string;
  public name: string;
  public surname: string;
  public birth: number;
  public gender: Gender;
  public country: string;
  public continent: string;
  public ageCategory: AgeCategory;
  public profilePictureUrl: string;
  public createdAt?: number;
}
