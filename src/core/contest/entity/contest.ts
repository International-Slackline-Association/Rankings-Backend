import { ContestGender, ContestType, Discipline } from 'shared/enums';
import { Utils } from 'shared/utils';

export class Contest {
  public readonly id: string;
  public readonly name: string;
  public readonly date: Date;
  public readonly city: string;
  public readonly country: string;
  public readonly discipline: Discipline;
  public readonly contestType: ContestType;
  public readonly contestGender: ContestGender;
  public readonly prize: number;
  public readonly profileUrl: string;
  public readonly thumbnailUrl: string;
  public readonly infoUrl: string;
  public readonly createdAt?: number;

  public get year(): number {
    return Utils.dateToMoment(this.date).year();
  }

  public get prizeString(): string {
    return this.prize.toString() + ' Euro';
  }
  constructor(init: {
    id: string;
    name: string;
    date: Date;
    city: string;
    country: string;
    discipline: Discipline;
    contestType: ContestType;
    contestGender: ContestGender;
    prize: number;
    profileUrl: string;
    thumbnailUrl: string;
    infoUrl: string;
    createdAt?: number;
  }) {
    if (init) {
      if (!init.thumbnailUrl && init.profileUrl) {
        const [fileType, ...url] = init.profileUrl.split('.').reverse();
        if (fileType === 'jpg' || fileType === 'png') {
          const thumbnailUrl = `${url.reverse().join('.')}_thumbnail.${fileType}`;
          init.thumbnailUrl = thumbnailUrl;
        }
      }
      Object.assign(this, init);
    }
  }
}
