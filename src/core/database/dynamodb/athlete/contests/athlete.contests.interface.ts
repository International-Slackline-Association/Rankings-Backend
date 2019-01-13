import { Discipline } from 'shared/enums';
import { DDBTableKeyAttrs } from '../../interfaces/table.interface';

export type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly place: number;
  readonly createdAt: number;
}

interface NonKeyAttrs extends Attrs {}
export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBAthleteContestItem extends Attrs {
  readonly athleteId: string;
  readonly contestId: string;
  readonly discipline: Discipline;
  readonly date: string;
  readonly points: number;
}
