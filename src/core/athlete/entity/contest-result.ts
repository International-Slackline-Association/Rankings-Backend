import { Discipline } from 'shared/enums';

export class AthleteContestResult {
  public readonly athleteId: string;
  public readonly contestId: string;
  public readonly contestDate: Date;
  public readonly contestDiscipline: Discipline;
  public readonly points: number;
  public readonly place: number;
  public readonly createdAt?: number;

  constructor(init: {
    athleteId: string;
    contestId: string;
    contestDate: Date;
    contestDiscipline: Discipline;
    points: number;
    place: number;
    createdAt?: number;
  }) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
