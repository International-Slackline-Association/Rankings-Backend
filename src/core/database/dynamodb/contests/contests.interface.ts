import { DDBTableKeyAttrs, NumberSet } from '../interfaces/table.interface';
import { Discipline, ContestCategory, PrizeUnit } from 'shared/enums';

type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly name: string;
  readonly city: string;
  readonly country: string;
  readonly totalprize: number;
  readonly prizeUnit: PrizeUnit;
  readonly profilePictureUrl: string;
  readonly createdAt: number;
}

interface NonKeyAttrs extends Attrs {
  readonly disciplines: NumberSet;
  readonly categories: NumberSet;
}
export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBContestItem extends Attrs {
  readonly contestId: string;
  readonly disciplines: Discipline[];
  readonly categories: ContestCategory[];
  readonly year: number;
  readonly date: number;
  readonly normalizedName: string;
}
