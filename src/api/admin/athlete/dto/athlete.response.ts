export interface IAthleteResponseItem {
  readonly id: string;
  readonly name: string;
  readonly surname: string;
  readonly profileUrl: string;
  readonly country: string;
  readonly gender: number;
  readonly birthdate: string;
  readonly email: string;
  readonly city: string;
  readonly infoUrl: string;
}

export class AthleteResponse {
  public readonly athlete: IAthleteResponseItem;

  constructor(athlete: IAthleteResponseItem) {
    this.athlete = athlete;
  }
}
