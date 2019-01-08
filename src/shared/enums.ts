import { $enum } from 'ts-enum-util';

export enum Discipline {
  Overall = 0,
  Trickline = 1,
  Trickline_Aerial = 2,
  Trickline_JibAndStatic = 3,
  Trickline_Transfer = 4,
  Contact_HighLongWaterline = 5,
  Speedline = 6,
  Speedline_Sprint = 7,
  Speedline__HighLongWaterline = 8,
  Endurance = 9,
  Blind = 10,
  Rigging = 11,
}

export const CategoricalDisciplines = [Discipline.Overall, Discipline.Trickline, Discipline.Speedline];

export const CompetitionDisciplines = $enum(Discipline)
  .getValues()
  .filter(d => CategoricalDisciplines.indexOf(d) <= -1)
  .sort((a, b) => a - b); // ascending

export enum Gender {
  All = 0,
  Men = 1,
  Women = 2,
}

export const ValidGenders = [Gender.Men, Gender.Women];

export enum AgeCategory {
  All = 0,
  Youth = 1,
}

export const ValidAgeCategories = [AgeCategory.Youth];

export enum ContestCategory {
  WorldGames = 0,
  WorldCup = 1,
  Masters = 2,
  NationalChampionship = 3,
  Open = 4,
  Challenge = 5,
}

export const ContestCategories = $enum(ContestCategory)
  .getValues()
  .sort((a, b) => a - b); // ascending

export enum PrizeUnit {
  Euro = '€',
  USD = '$',
}

export enum AuthenticationRole {
  admin = 'admin',
}
