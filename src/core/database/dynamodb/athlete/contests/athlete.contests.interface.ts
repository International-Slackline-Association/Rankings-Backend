import { DDBTableKeyAttrs, NumberSet } from '../../interfaces/table.interface';
import { Discipline, ContestSize } from 'shared/enums';

type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly rank: number;
  readonly createdAt: number;
}

interface NonKeyAttrs extends Attrs {}
export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBAthleteContestItem extends Attrs {
  readonly athleteId: string;
  readonly contestId: string;
  readonly discipline: Discipline;
  readonly year: number;
  readonly date: number;
  readonly points: number;
}
