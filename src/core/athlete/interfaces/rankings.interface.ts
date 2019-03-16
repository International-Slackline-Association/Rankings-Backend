import { AgeCategory, Discipline, Gender, RankingType, Year } from 'shared/enums';

export interface RankingsCategory {
  readonly rankingType: RankingType;
  readonly discipline: Discipline;
  readonly ageCategory: AgeCategory;
  readonly gender: Gender;
  readonly year: Year;
}

export interface AthleteRankingsCategory extends RankingsCategory {
  readonly athleteId: string;
}
