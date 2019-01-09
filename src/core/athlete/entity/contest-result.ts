import { Discipline } from 'shared/enums';

export class AthleteContestResult {
  public readonly athleteId: string;
  public readonly contestId: string;
  public readonly contestDate: Date;
  public readonly contestDiscipline: Discipline;
  public readonly points: number;
  public readonly place: number;
  public readonly createdAt?: number;
}
