import { Discipline } from 'shared/enums';

export class AthleteContestResult {
  public id: string;
  public contestId: string;
  public contestDate: number;
  public contestDiscipline: Discipline;
  public points: number;
  public place: number;
  public createdAt?: number;
}
