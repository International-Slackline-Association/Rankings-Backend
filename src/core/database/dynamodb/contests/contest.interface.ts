import { ContestCategory, Discipline } from 'shared/enums';
import { DDBTableKeyAttrs } from '../interfaces/table.interface';

type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly name: string;
  readonly normalizedName: string;
  readonly city: string;
  readonly country: string;
  readonly prize: number;
  readonly category: ContestCategory;
  readonly profileUrl: string;
  readonly infoUrl: string;
  readonly createdAt: number;
}

interface NonKeyAttrs extends Attrs {}

export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBContestItem extends Attrs {
  readonly contestId: string;
  readonly discipline: Discipline;
  readonly year: number;
  readonly date: string;
}
