import { Discipline } from 'shared/enums';

export class SubmitContestResponse {
  public readonly id: string;
  public readonly discipline: Discipline;
  constructor(id: string, discipline: Discipline) {
    this.id = id;
    this.discipline = discipline;
  }
}
