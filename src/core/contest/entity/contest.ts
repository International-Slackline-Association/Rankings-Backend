import * as moment from 'moment';
import { Discipline, ContestCategory, PrizeUnit } from 'shared/enums';

export interface IContest {
  id: string;
  name: string;
  date: number;
  city: string;
  country: string;
  disciplines: {
    discipline: Discipline;
    category: ContestCategory;
    prize: {
      value: number;
      unit: PrizeUnit;
    };
  }[];
  profilePictureUrl: string;
  createdAt?: number;
}
export interface IContestDiscipline {
  id: string;
  name: string;
  prize: string;
  size: ContestCategory;
  date: number;
  city: string;
  country: string;
  discipline: Discipline;
  profilePictureUrl: string;
}

export class Contest implements IContest {
  id: string;
  name: string;
  date: number;
  city: string;
  country: string;
  disciplines: {
    discipline: Discipline;
    category: ContestCategory;
    prize: {
      value: number;
      unit: PrizeUnit;
    };
  }[];
  profilePictureUrl: string;
  createdAt?: number;

  get totalPrize(): number {
    return this.disciplines.map(d => d.prize.value).reduce((p, d) => {
      return p + d;
    }, 0);
  }
  get prizeUnit(): PrizeUnit {
    let unit: PrizeUnit;
    for (const discipline of this.disciplines) {
      if (unit && unit !== discipline.prize.unit) {
        throw new Error(
          'All the disciplines of contest should hava identical prize units',
        );
      }
      unit = discipline.prize.unit;
    }
    return unit;
  }

  constructor(params: IContest) {
    this.id = params.id;
    this.name = params.name;
    this.date = params.date;
    this.city = params.city;
    this.country = params.country;
    this.disciplines = params.disciplines;
    this.profilePictureUrl = params.profilePictureUrl;
    this.createdAt = params.createdAt || moment().unix();
  }
}
