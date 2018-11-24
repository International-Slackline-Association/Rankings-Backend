import { DDBTableKeyAttrs } from '../../interfaces/table.interface';
import { Discipline, AgeCategory, Gender } from 'shared/enums';

type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly name: string;
  readonly surname: string;
  readonly country: string;
  readonly continent: string;
  readonly createdAt: number;
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
