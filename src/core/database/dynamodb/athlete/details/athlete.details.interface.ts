import { AgeCategory, Gender } from 'shared/enums';
import { DDBTableKeyAttrs } from '../../interfaces/table.interface';

export type KeyAttrs = DDBTableKeyAttrs;

interface Attrs {
  readonly name: string;
  readonly surname: string;
  readonly normalizedFullname: string;
  readonly birthdate: string;
  readonly gender: Gender;
  readonly country: string;
  readonly profileUrl: string;
  readonly thumbnailUrl: string;
  readonly createdAt: number;
  readonly email: string;
  readonly city: string;
  readonly infoUrl: string;
}
interface NonKeyAttrs extends Attrs {}

export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBAthleteDetailItem extends Attrs {
  readonly athleteId: string;
  readonly normalizedName: string;
}
