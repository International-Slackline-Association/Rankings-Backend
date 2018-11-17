import { DDBTableKeyAttrs, NumberSet } from '../interfaces/table.interface';
import { Discipline } from 'shared/enums';

type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly name: string;
  readonly city: string;
  readonly country: string;
  readonly totalprize: string;
  readonly createdAt: number;
}

interface NonKeyAttrs extends Attrs {
  readonly disciplines: NumberSet;
}
export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBContestItem extends Attrs {
  readonly contestId: string;
  readonly disciplines: Discipline[];
  readonly year: number;
  readonly date: number;
}