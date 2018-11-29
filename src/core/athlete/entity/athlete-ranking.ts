import { AgeCategory, Discipline, Gender } from 'shared/enums';

export class AthleteRanking {
  public readonly id: string;
  public readonly name: string;
  public readonly surname: string;
  public readonly gender: Gender;
  public readonly country: string;
  public readonly continent: string;
  public readonly ageCategory: AgeCategory;
  public readonly lastUpdatedAt?: number;
  public readonly points: number;
  public readonly discipline: Discipline;
  public readonly year: number;
}
