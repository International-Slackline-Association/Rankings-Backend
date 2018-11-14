import { DDBTableKeyAttrs } from '../interfaces/table.interface';

type KeyAttrs = DDBTableKeyAttrs;

interface NonKeyAttrs {
    readonly name: string;
    readonly surname: string;
    readonly birthEpoch: number;
    readonly gender: 'men' | 'women';
    readonly country: string;
    readonly continent: string;
    readonly ageCategory: string;
    readonly createdAt: number;
}

export type AllAttrs = KeyAttrs & NonKeyAttrs;

export interface DDBAthleteDetailItem extends NonKeyAttrs {
    AthleteId: string;
}
