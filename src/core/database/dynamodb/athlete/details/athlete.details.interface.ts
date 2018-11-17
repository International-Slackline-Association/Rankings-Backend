import { DDBTableKeyAttrs } from '../../interfaces/table.interface';
import { Gender, AgeCategory } from 'shared/enums';

type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly surname: string;
  readonly birthEpoch: number;
  readonly gender: Gender;
  readonly country: string;
  readonly continent: string;
  readonly ageCategory: AgeCategory;
  readonly createdAt: number;
}
interface NonKeyAttrs extends Attrs {}

export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBAthleteDetailItem extends Attrs {
  readonly athleteId: string;
  readonly name: string;
}
