import { AgeCategory, Gender } from 'shared/enums';
import { DDBTableKeyAttrs } from '../../interfaces/table.interface';

export type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly name: string;
  readonly surname: string;
  readonly birthEpoch: number;
  readonly gender: Gender;
  readonly country: string;
  readonly continent: string;
  readonly profilePictureUrl: string;
  readonly createdAt: number;
}
interface NonKeyAttrs extends Attrs {}

export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBAthleteDetailItem extends Attrs {
  readonly athleteId: string;
  readonly normalizedName: string;
}
