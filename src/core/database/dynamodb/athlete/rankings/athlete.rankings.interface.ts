import { AgeCategory, Discipline, Gender, Year } from 'shared/enums';
import { DDBTableKeyAttrs } from '../../interfaces/table.interface';

type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly name: string;
  readonly birthdate: string;
  readonly surname: string;
  readonly country: string;
  readonly normalizedName: string;
  readonly lastUpdatedAt?: number;
}

interface NonKeyAttrs extends Attrs {}
export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBAthleteRankingsItem extends Attrs {
  readonly athleteId: string;
  readonly discipline: Discipline;
  readonly ageCategory: AgeCategory;
  readonly gender: Gender;
  readonly year: number;
  readonly points: number;
}

export interface DDBRankingsItemPrimaryKey {
  readonly discipline: Discipline;
  readonly ageCategory: AgeCategory;
  readonly gender: Gender;
  readonly year: Year;
}

export interface DDBAthleteRankingsItemPrimaryKey extends DDBRankingsItemPrimaryKey {
  readonly athleteId: string;
}
