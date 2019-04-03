import * as moment from 'moment';

import { AgeCategory, Discipline, Gender, RankingType } from 'shared/enums';
import { Utils } from 'shared/utils';

export class AthleteRanking {
  public readonly id: string;
  public readonly name: string;
  public readonly surname: string;
  public readonly gender: Gender;
  public readonly country: string;
  public readonly birthdate?: Date;
  public readonly ageCategory: AgeCategory;
  public readonly lastUpdatedAt?: number;
  public readonly points: number;
  public readonly discipline: Discipline;
  public readonly year: number;
  public readonly rankingType: RankingType;
  public readonly contestCount?: number;

  public get age(): number {
    const birthDate = Utils.dateToMoment(this.birthdate);
    if (birthDate) {
      const age = moment()
        .utc()
        .diff(birthDate, 'years');
      return age;
    }
    return null;
  }

  constructor(init: {
    id: string;
    name: string;
    surname: string;
    gender: Gender;
    country: string;
    birthdate: Date;
    ageCategory: AgeCategory;
    lastUpdatedAt?: number;
    points: number;
    discipline: Discipline;
    year: number;
    rankingType: RankingType;
    contestCount?: number;
  }) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
