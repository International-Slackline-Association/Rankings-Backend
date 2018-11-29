import { $enum } from 'ts-enum-util';

export enum Discipline {
  Overall = 0,
  Trickline = 1,
  Trickline_Arial = 2,
  Trickline_JibAndStatic = 3,
  Trickline_TransferSingle = 4,
  Trickline_TransferTandem = 5,
  HighLongWaterline_Contact = 6,
  Speedline = 7,
  Speedline_Sprint = 8,
  Speedline__HighLongWaterline = 9,
  Endurance = 10,
  Blind = 11,
  Rigging = 12,
}

export const CategoricalDisciplines = [
  Discipline.Overall,
  Discipline.Trickline,
  Discipline.Speedline,
];

export const CompetitionDisciplines = $enum(Discipline)
  .getValues()
  .filter(d => CategoricalDisciplines.indexOf(d) <= -1);

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

export enum PrizeUnit {
  Euro = '€',
  USD = '$',
}

export enum AuthenticationRole {
  admin = 'admin',
}
