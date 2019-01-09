import { ContestCategory, Discipline } from 'shared/enums';

export class Contest {
  public id: string;
  public name: string;
  public date: Date;
  public city: string;
  public country: string;
  public discipline: Discipline;
  public contestCategory: ContestCategory;
  public prize: number;
  public profileUrl: string;
  public readonly infoUrl: string;
  public createdAt?: number;

  constructor(init: {
    id: string;
    name: string;
    date: Date;
    city: string;
    country: string;
    discipline: Discipline;
    contestCategory: ContestCategory;
    prize: number;
    profileUrl: string;
    infoUrl: string;
    createdAt?: number;
  }) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
