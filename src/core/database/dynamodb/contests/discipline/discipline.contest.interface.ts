import { Discipline, ContestCategory, PrizeUnit } from 'shared/enums';
import { DDBTableKeyAttrs } from '../../interfaces/table.interface';

type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly name: string;
  readonly city: string;
  readonly country: string;
  readonly prize: number;
  readonly prizeUnit: PrizeUnit;
  readonly category: ContestCategory;
  readonly createdAt: number;
}

interface NonKeyAttrs extends Attrs {
}
export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBDisciplineContestItem extends Attrs {
  readonly contestId: string;
  readonly discipline: Discipline;
  readonly year: number;
  readonly date: number;
}