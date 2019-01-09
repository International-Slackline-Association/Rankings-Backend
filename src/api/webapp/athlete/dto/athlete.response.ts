export interface IAthleteResponseItem {
  readonly id: string;
  readonly name: string;
  readonly surname: string;
  readonly age: number;
  readonly country: string;
  readonly profileUrl: string;
  readonly overallRank: string;
  readonly infoUrl: string;
}

export class AthleteResponse {
  public readonly athlete: IAthleteResponseItem;

  constructor(athlete: IAthleteResponseItem) {
    this.athlete = athlete;
  }
}
