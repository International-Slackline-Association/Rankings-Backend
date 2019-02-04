import { ContestType, Discipline } from 'shared/enums';
import { DDBTableKeyAttrs } from '../interfaces/table.interface';

export type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly name: string;
  readonly normalizedName: string;
  readonly city: string;
  readonly country: string;
  readonly prize: number;
  readonly category: ContestType;
  readonly profileUrl: string;
  readonly thumbnailUrl: string;
  readonly infoUrl: string;
  readonly createdAt: number;
}

interface NonKeyAttrs extends Attrs {}

export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBContestItem extends Attrs {
  readonly contestId: string;
  readonly discipline: Discipline;
  readonly date: string;
}
