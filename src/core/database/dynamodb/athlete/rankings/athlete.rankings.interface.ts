import { DDBTableKeyAttrs } from '../../interfaces/table.interface';
import { Discipline, AgeCategory } from 'shared/enums';

type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly gender: string;
  readonly country: string;
  readonly continent: string;
  readonly ageCategory: AgeCategory;
  readonly createdAt: number;
}

interface NonKeyAttrs extends Attrs {}
export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBAthleteRankingsItem extends Attrs {
  readonly athleteId: string;
  readonly discipline: Discipline;
  readonly year: number;
  readonly points: number;
}
